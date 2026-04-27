import { useSyncExternalStore, useState, type SyntheticEvent } from 'react'
import { iconSvg } from '../../lib/icons'
import { request } from '../../lib/app/apiClient'
import { syncLocalToAccount } from '../../lib/app/remoteSync'
import { getSnapshot, setState, subscribe } from '../../lib/store'
import styles from './LoginCard.module.css'

type Step = 'email' | 'code'
type Tone = 'info' | 'error' | 'success'

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
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [status, setStatus] = useState('')
  const [tone, setTone] = useState<Tone>('info')

  const showStatus = (msg: string, t: Tone) => { setStatus(msg); setTone(t) }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state.authenticated) return

    if (step === 'email') {
      showStatus('Sending code…', 'info')
      try {
        const res = await request<{ devCode?: string }>('/api/auth/request-code', {
          method: 'POST',
          body: JSON.stringify({ email })
        })
        setPendingEmail(email)
        setStep('code')
        showStatus(
          res.devCode ? `Dev mode: your code is ${res.devCode}` : 'Code sent. Enter the digits below when they arrive.',
          'success'
        )
      } catch (err) {
        showStatus(err instanceof Error ? err.message : 'Something went wrong.', 'error')
      }
    } else {
      showStatus('Verifying code…', 'info')
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
    setCode('')
    setStatus('')
  }

  const handleChangeEmail = () => {
    setStep('email')
    setCode('')
    setStatus('')
  }

  if (state.authenticated && state.userEmail) {
    return (
      <div className={`card ${styles.card}`} aria-labelledby="login-card-title">
        <p id="sync-state" className={styles.syncState}>
          {`Synced to ${state.userEmail}`}
        </p>
        <div className={styles.head}>
          <span className={styles.icon} dangerouslySetInnerHTML={{ __html: iconSvg('mail') }} />
          <div>
            <h2 id="login-card-title">You are signed in</h2>
            <p className={`muted ${styles.sub}`}>
              Trips and tracked countries sync to your account. Sign out anytime — your saved data stays on this account.
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className="btn secondary" style={{ width: '100%' }} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className={`card ${styles.card}`} aria-labelledby="login-card-title" onSubmit={handleSubmit}>
      <p id="sync-state" className={styles.syncState}>
        Guest mode. Your data stays in this browser until you save it to an account.
      </p>

      <div className={styles.head}>
        <span className={styles.icon} dangerouslySetInnerHTML={{ __html: iconSvg('mail') }} />
        <div>
          <h2 id="login-card-title">Save to your account</h2>
          <p className={`muted ${styles.sub}`}>
            {step === 'code' ?
              'Enter the code from your email, then sign in to upload this browser\'s trips.' :
              'Enter your email when you want to sync trips across devices. We will send a one-time code — no password to remember.'}
          </p>
        </div>
      </div>

      {step === 'code' && (
        <div className={styles.pendingBanner}>
          <span className={styles.pendingIcon} dangerouslySetInnerHTML={{ __html: iconSvg('pulse') }} />
          <div>
            <p className={styles.pendingTitle}>Check your inbox</p>
            <p className={styles.pendingText}>
              {'We sent a 6-digit code to '}
              <strong>{maskEmail(pendingEmail)}</strong>
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
          <label htmlFor="login-code">6-digit code</label>
          <small id="login-code-help" className="field-hint">Codes expire after a short time. Check spam if you do not see it.</small>
          <input
            id="login-code"
            className={`ui-input ${styles.codeInput}`}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            spellCheck={false}
            aria-describedby="login-code-help"
            required
            value={code}
            onChange={e => { setCode(e.target.value) }}
          />
        </div>
      )}

      <p className={styles.status} role="status" aria-live="polite" data-tone={tone !== 'info' ? tone : undefined}>
        {status}
      </p>

      <div className={styles.actions}>
        <button type="submit" className="btn">
          {step === 'code' ? 'Sign in and sync' : 'Email me a code'}
        </button>
        {step === 'code' && (
          <button type="button" className={styles.changeEmail} onClick={handleChangeEmail}>
            ← Use a different email
          </button>
        )}
      </div>
    </form>
  )
}
