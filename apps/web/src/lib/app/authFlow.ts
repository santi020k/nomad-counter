import { request } from './apiClient'
import { leaveLoginCodeWaitState, maskEmailForDisplay } from './authUi'
import { $, formString } from './dom'
import { setLoginStatus } from './formStatus'
import type { State } from './types'

export const requestCode = async (form: HTMLFormElement) => {
  const data = new FormData(form)
  const email = formString(data, 'email')

  setLoginStatus('Sending code…', 'info')

  const response = await request<{ devCode?: string }>('/api/auth/request-code', {
    method: 'POST',
    body: JSON.stringify({ email })
  })

  form.dataset.codeRequested = 'true'
  form.dataset.loginStep = 'code'
  form.dataset.pendingEmail = email

  $('#code-field')?.removeAttribute('hidden')
  $('#login-pending-banner')?.removeAttribute('hidden')
  $('#login-change-email')?.removeAttribute('hidden')

  const masked = $('#login-email-masked')

  if (masked) {
    masked.textContent = maskEmailForDisplay(email)
  }

  const emailInput = $<HTMLInputElement>('#login-email')

  if (emailInput) {
    emailInput.readOnly = true
  }

  const codeInput = form.elements.namedItem('code')
  const primaryBtn = $('#login-primary-btn')

  if (codeInput instanceof HTMLInputElement) {
    codeInput.required = true
    codeInput.focus()
  }

  if (primaryBtn) {
    primaryBtn.textContent = 'Sign in and sync'
  }

  const cardSub = $('#login-card-sub')

  if (cardSub) {
    cardSub.textContent = 'Enter the code from your email, then sign in to upload this browser’s trips.'
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  if (response.devCode) {
    setLoginStatus(`Dev mode: your code is ${response.devCode}`, 'success')
  } else {
    setLoginStatus('Code sent. Enter the digits below when they arrive.', 'success')
  }
}

export const verifyCode = async (
  form: HTMLFormElement,
  state: State,
  syncLocalToAccount: () => Promise<void>
) => {
  const data = new FormData(form)

  setLoginStatus('Verifying code…', 'info')

  const response = await request<{ user: { email: string } }>('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      email: data.get('email'),
      code: data.get('code')
    })
  })

  state.authenticated = true
  state.userEmail = response.user.email

  setLoginStatus('Saving trips and settings to your account…', 'info')

  await syncLocalToAccount()

  leaveLoginCodeWaitState(form, { clearEmail: false, clearStatus: false })
  setLoginStatus('Signed in. Your counter is synced.', 'success')

  $('#trip-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
