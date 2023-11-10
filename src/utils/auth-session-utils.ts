import i18next from 'i18next'

import { supabase } from '@libs/supabase/supabase'
import { toastError } from '@libs/toast-alerts/toast-alert'

import { UserAuthSchema, type UserData, UserDataSchema } from '@models/auth-model'

export const parseAuthSession = (session: unknown): UserData | undefined => {
  const result = UserAuthSchema.safeParse(session)

  if (session === null) return undefined

  if (result?.success) {
    const { user: { user_metadata: userMetadata } } = result.data
    const splitNames = userMetadata?.name?.split(' ')
    const splitFirstName = splitNames?.[0]?.split('') ?? ''
    const splitLastName = splitNames?.[1]?.split('') ?? ''
    const shortName = `${splitFirstName?.[0] ?? ''}${splitLastName?.[0] ?? ''}`

    const userDataSchema = UserDataSchema.safeParse({
      isSignIn: true,
      name: userMetadata?.name,
      email: userMetadata?.email,
      avatar: userMetadata?.avatar_url,
      shortName,
      initialLetter: splitFirstName?.[0] ?? ''
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
  })
  if (error) toastError({ text: i18next.t('common:messages.error') ?? '', duration: 3000 })
}

export const handleSignOut = async ({ logOut }: { logOut: () => void }): Promise<void> => {
  await supabase.auth.signOut().then(({ error }) => {
    if (!error) logOut()
  })
}
