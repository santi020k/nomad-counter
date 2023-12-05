import i18next from 'i18next'
import { create } from 'zustand'

import { supabase } from '@libs/supabase/supabase'
import { toastError } from '@libs/toast-alerts/toast-alert'

import { type UserData, UserDataSchema } from '@models/auth-model'

import { parseAuthSession } from '@utils/auth-session-utils'

export interface UserAuthState {
  user: UserData
  logIn: (user: UserData) => void
  logOut: () => Promise<void>
  fetchSession: () => Promise<void>
}

const initialUser = UserDataSchema.parse({
  isSignIn: false,
  name: '',
  email: '',
  avatar: '',
  shortName: '',
  initialLetter: ''
})

const ERROR_MESSAGE = i18next.t('common:messages.error') ?? ''
const TOAST_DURATION = 3000

const useAuthStore = create<UserAuthState>((set) => ({
  user: initialUser,
  logIn: (user) => { set({ user: { isSignIn: true, ...user } }) },
  logOut: async () => {
    const { error } = await supabase.auth.signOut()
    console.log('🚀 ~ file: use-auth-store.ts:35 ~ logOut: ~ error:', error)
    if (!error) set({ user: initialUser })
    if (error) toastError({ text: ERROR_MESSAGE, duration: TOAST_DURATION })
  },
  fetchSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🚀 ~ file: use-auth-store.ts:42 ~ fetchSession: ~ session:', session)
      const parseAuthResult = parseAuthSession(session)

      if (parseAuthResult) set({ user: parseAuthResult })
    } catch (error) {
      console.error(error)
      toastError({ text: ERROR_MESSAGE, duration: TOAST_DURATION })
    }
  }
}))

export default useAuthStore
