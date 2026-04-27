import type { Bindings } from '../types.js'

interface SendCodeParams {
  code: string
  email: string
  env: Bindings
}

export const sendLoginCode = async ({ code, email, env }: SendCodeParams): Promise<'sent' | 'skipped'> => {
  if (!env.RESEND_API_KEY) {
    return 'skipped'
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.AUTH_EMAIL_FROM ?? 'Nomad Counter <login@nomad.santi020k.com>',
      to: email,
      subject: 'Your Nomad Counter sign-in code',
      text: `Your Nomad Counter code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your Nomad Counter code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p>It expires in 10 minutes.</p>`
    })
  })

  if (!response.ok) {
    throw new Error('Unable to send email code.')
  }

  return 'sent'
}
