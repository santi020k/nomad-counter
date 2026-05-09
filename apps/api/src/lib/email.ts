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
      from: env.AUTH_EMAIL_FROM ?? 'Nomad Counter <login@santi020k.com>',
      to: email,
      subject: 'Your Nomad Counter sign-in code',
      text: `Your Nomad Counter code is ${code}\n\nIt expires in 10 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center; color: #1F2937; background-color: #F8FAFC; border-radius: 12px;">
          <h1 style="margin: 0 0 24px; font-size: 22px; font-weight: 600; color: #471AA0;">Nomad Counter</h1>
          <p style="margin: 0 0 32px; font-size: 16px; color: #6B7280; line-height: 1.5;">Here is your secure sign-in code.</p>
          <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; margin-bottom: 32px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
            <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1F2937;">${code}</p>
          </div>
          <p style="margin: 0; font-size: 14px; color: #9CA3AF;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    })
  })

  if (!response.ok) {
    const errorText = await response.text()

    console.error('Resend API Error:', errorText)

    throw new Error(`Unable to send email code. Resend error: ${errorText}`)
  }

  return 'sent'
}
