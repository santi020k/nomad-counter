import { $ } from './dom'
import { setLoginStatus } from './formStatus'

export const maskEmailForDisplay = (email: string): string => {
  const trimmed = email.trim()
  const [localPart, domain] = trimmed.split('@')

  if (!domain || localPart === undefined) {
    return trimmed
  }

  if (localPart.length <= 1) {
    return `*@${domain}`
  }

  if (localPart.length === 2) {
    return `${localPart.at(0) ?? '*'}*@${domain}`
  }

  return `${localPart.slice(0, 2)}…@${domain}`
}

export const leaveLoginCodeWaitState = (
  form: HTMLFormElement,
  options: { clearEmail: boolean, clearStatus?: boolean }
) => {
  form.dataset.codeRequested = 'false'

  form.dataset.loginStep = 'email'

  delete form.dataset.pendingEmail

  $('#login-pending-banner')?.setAttribute('hidden', '')

  $('#login-change-email')?.setAttribute('hidden', '')

  $('#code-field')?.setAttribute('hidden', '')

  const emailInput = $<HTMLInputElement>('#login-email')

  if (emailInput) {
    emailInput.readOnly = false

    if (options.clearEmail) {
      emailInput.value = ''
    }
  }

  const codeInput = $<HTMLInputElement>('#login-code')

  if (codeInput) {
    codeInput.value = ''

    codeInput.required = false
  }

  const primary = $('#login-primary-btn')

  if (primary) {
    primary.textContent = 'Email me a code'
  }

  if (options.clearStatus !== false) {
    setLoginStatus('', 'info')
  }
}
