import {
  useRef,
  useSyncExternalStore,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type SyntheticEvent
} from 'react'
import { iconSvg } from '../../lib/icons'
import { request } from '../../lib/app/apiClient'
import { getMessages } from '../../lib/app/i18n'
import { syncLocalToAccount } from '../../lib/app/remoteSync'
import { getSnapshot, setState, subscribe } from '../../lib/store'
import styles from './LoginCard.module.css'

type Step = 'email' | 'code'
type Tone = 'info' | 'error' | 'success'

const codeLength = 6
const emptyCodeDigits = (): string[] => Array.from({ length: codeLength }, () => '')

function maskEmail(email: string): string {
  const trimmed = email.trim()
  const [local, domain] = trimmed.split('@')
  if (!domain || local === undefined) return trimmed
  if (local.length <= 1) return `*@${domain}`
  if (local.length === 2) return `${local[0] ?? '*'}*@${domain}`
  return `${local.slice(0, 2)}…@${domain}`
}

export default function LoginCard() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const messages = getMessages(state.locale)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [codeDigits, setCodeDigits] = useState<string[]>(emptyCodeDigits)
  const [pendingEmail, setPendingEmail] = useState('')
  const [status, setStatus] = useState('')
  const [tone, setTone] = useState<Tone>('info')
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const code = codeDigits.join('')

  const showStatus = (msg: string, t: Tone) => { setStatus(msg); setTone(t) }
  const sanitizeCode = (value: string): string => value.replace(/\D/g, '').slice(0, codeLength)
  const focusCodeInput = (index: number): void => {
    codeInputRefs.current[Math.min(Math.max(index, 0), codeLength - 1)]?.focus()
  }
  const focusFirstMissingDigit = (): void => {
    const missingIndex = codeDigits.findIndex(digit => digit === '')
    focusCodeInput(missingIndex === -1 ? codeLength - 1 : missingIndex)
  }
  const applyCodeFrom = (startIndex: number, value: string): void => {
    const digits = sanitizeCode(value)
    if (digits.length === 0) return

    setCodeDigits(prev => {
      const next = [...prev]
      for (const [offset, digit] of Array.from(digits).entries()) {
        const targetIndex = startIndex + offset
        if (targetIndex >= codeLength) break
        next[targetIndex] = digit
      }
      return next
    })

    focusCodeInput(Math.min(startIndex + digits.length, codeLength - 1))
  }

  const handleCodeChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    e.currentTarget.setCustomValidity('')
    applyCodeFrom(index, e.currentTarget.value)
  }

  const handleCodePaste = (index: number, e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    applyCodeFrom(index, e.clipboardData.getData('text'))
  }

  const handleCodeKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && codeDigits[index] === '' && index > 0) {
      e.preventDefault()
      setCodeDigits(prev => {
        const next = [...prev]
        next[index - 1] = ''
        return next
      })
      focusCodeInput(index - 1)
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusCodeInput(index - 1)
    }

    if (e.key === 'ArrowRight' && index < codeLength - 1) {
      e.preventDefault()
      focusCodeInput(index + 1)
    }
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state.authenticated) return

    if (step === 'email') {
      showStatus(messages.sendingCode, 'info')
      try {
        const res = await request<{ devCode?: string }>('/api/auth/request-code', {
          method: 'POST',
          body: JSON.stringify({ email })
        })
        setPendingEmail(email)
        setStep('code')
        showStatus(
          res.devCode ? `Dev mode: your code is ${res.devCode}` : messages.codeSent,
          'success'
        )
      } catch (err) {
        showStatus(err instanceof Error ? err.message : 'Something went wrong.', 'error')
      }
    } else {
      if (code.length !== codeLength) {
        showStatus(messages.invalidLoginCode, 'error')
        focusFirstMissingDigit()
        return
      }

      showStatus(messages.verifyingCode, 'info')
      try {
        const res = await request<{ user: { email: string } }>('/api/auth/verify-code', {
          method: 'POST',
          body: JSON.stringify({ email, code })
        })
        setState(prev => ({ ...prev, authenticated: true, userEmail: res.user.email }))
        showStatus('Saving trips and settings to your account…', 'info')
        await syncLocalToAccount()
        showStatus('Signed in. Your counter is synced.', 'success')
      } catch (err) {
        showStatus(err instanceof Error ? err.message : 'Something went wrong.', 'error')
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await request('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) })
    } catch { /* session clears on next load */ }
    setState(prev => ({ ...prev, authenticated: false, userEmail: null }))
    setStep('email')
    setCodeDigits(emptyCodeDigits())
    setStatus('')
  }

  const handleChangeEmail = () => {
    setStep('email')
    setCodeDigits(emptyCodeDigits())
    setStatus('')
  }

  if (state.authenticated && state.userEmail) {
    return (
      <div className={`card ${styles.card}`} aria-labelledby="login-card-title">
        <p id="sync-state" className={styles.syncState}>
          {messages.signedInStatus(state.userEmail)}
        </p>
        <div className={styles.head}>
          <span className={styles.icon} dangerouslySetInnerHTML={{ __html: iconSvg('mail') }} />
          <div>
            <h2 id="login-card-title">{messages.signedIn}</h2>
            <p className={`muted ${styles.sub}`}>
              Trips and tracked countries sync to your account. Sign out anytime — your saved data stays on this account.
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className="btn secondary" style={{ width: '100%' }} onClick={handleSignOut}>
            {messages.signOut}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className={`card ${styles.card}`} aria-labelledby="login-card-title" onSubmit={handleSubmit}>
      <p id="sync-state" className={styles.syncState}>
        {messages.defaultGuestState}
      </p>

      <div className={styles.head}>
        <span className={styles.icon} dangerouslySetInnerHTML={{ __html: iconSvg('mail') }} />
        <div>
          <h2 id="login-card-title">{messages.saveAccount}</h2>
          <p className={`muted ${styles.sub}`}>
            {step === 'code' ? messages.loginCodeIntro : messages.loginEmailIntro}
          </p>
        </div>
      </div>

      {step === 'code' && (
        <div className={styles.pendingBanner}>
          <span className={styles.pendingIcon} dangerouslySetInnerHTML={{ __html: iconSvg('pulse') }} />
          <div>
            <p className={styles.pendingTitle}>{messages.inboxTitle}</p>
            <p className={styles.pendingText}>
              {messages.inboxCodeSent(maskEmail(pendingEmail))}
            </p>
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="ui-input"
          name="email"
          type="email"
          autoComplete="email"
          required
          readOnly={step === 'code'}
          value={email}
          onChange={e => { setEmail(e.target.value) }}
        />
      </div>

      {step === 'code' && (
        <div className="field">
          <label htmlFor="login-code">{messages.loginCode}</label>
          <small id="login-code-help" className="field-hint">{messages.emailCodeHelp}</small>
          <div className={styles.codeGrid} role="group" aria-describedby="login-code-help">
            {codeDigits.map((digit, index) => (
              <input
                key={`login-code-${String(index)}`}
                ref={node => { codeInputRefs.current[index] = node }}
                id={index === 0 ? 'login-code' : undefined}
                className={styles.codeBox}
                name={`code-${String(index + 1)}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                pattern="[0-9]"
                maxLength={1}
                spellCheck={false}
                aria-label={`${messages.loginCode} ${String(index + 1)}`}
                aria-invalid={tone === 'error' && code.length !== codeLength ? true : undefined}
                aria-required="true"
                value={digit}
                onChange={e => { handleCodeChange(index, e) }}
                onKeyDown={e => { handleCodeKeyDown(index, e) }}
                onPaste={e => { handleCodePaste(index, e) }}
              />
            ))}
          </div>
        </div>
      )}

      <p className={styles.status} role="status" aria-live="polite" data-tone={tone !== 'info' ? tone : undefined}>
        {status}
      </p>

      <div className={styles.actions}>
        <button type="submit" className="btn">
            {step === 'code' ? messages.signInSync : messages.emailMeCode}
        </button>
        {step === 'code' && (
          <button type="button" className={styles.changeEmail} onClick={handleChangeEmail}>
            ←
            {' '}
            {messages.changeEmail}
          </button>
        )}
      </div>
    </form>
  )
}
