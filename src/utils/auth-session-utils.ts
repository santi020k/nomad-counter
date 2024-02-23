import { type Session } from '@supabase/supabase-js'
import i18next from 'i18next'

import { supabase } from '@libs/supabase/supabase'
import { toastError } from '@libs/toast-alerts/toast-alert'

import { UserAuthSchema, type UserData, UserDataSchema } from '@models/auth-model'

const ERROR_MESSAGE = i18next.t('common:messages.error') ?? ''
const TOAST_DURATION = 3000

export const parseAuthSession = (session: Session | undefined): UserData | undefined => {
  if (!session) return undefined

  const result = UserAuthSchema.safeParse(session)

  if (result?.success) {
    const { user } = result.data ?? {}
    const { user_metadata: userMetadata } = user ?? {}
    const splitNames = userMetadata?.name?.split(' ')
    const shortName = `${splitNames?.[0]?.[0] ?? ''}${splitNames?.[1]?.[0] ?? ''}`

    const userDataSchema = UserDataSchema.safeParse({
      isSignIn: true,
      name: userMetadata?.name,
      email: userMetadata?.email,
      avatar: userMetadata?.avatar_url,
      shortName,
      initialLetter: splitNames?.[0]?.[0] ?? ''
    })

    if (userDataSchema.success) {
      return userDataSchema.data
    }
  }

  return undefined
}

export const handleGoogleSignIn = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  }) ?? { error: undefined }
  if (error) {
    toastError({
      text: ERROR_MESSAGE,
      duration: TOAST_DURATION
    })
  }
}
