import { $ } from './dom'

type LoginTone = 'info' | 'error' | 'success'

type FormTone = 'ok' | 'error'

const setStatus = (selector: string, message: string, tone: string) => {
  const el = $(selector)

  if (!el) {
    return
  }

  el.textContent = message

  if (!message) {
    el.removeAttribute('data-tone')
  } else {
    el.dataset.tone = tone
  }
}

export const setLoginStatus = (message: string, tone: LoginTone = 'info') => {
  setStatus('#status', message, tone)
}

export const setTripFormStatus = (message: string, tone: FormTone = 'ok') => {
  setStatus('#trip-form-status', message, tone)
}

export const setHomeCountryFormStatus = (message: string, tone: FormTone = 'ok') => {
  setStatus('#home-country-form-status', message, tone)
}
