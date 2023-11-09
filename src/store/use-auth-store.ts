import i18next from 'i18next'
import { create } from 'zustand'

import { supabase } from '@libs/supabase/supabase'
import { toastError } from '@libs/toast-alerts/toast-alert'

import { type UserData, UserDataSchema } from '@models/auth-model'

import { parseAuthSession } from '@utils/parse-auth-session-utils'

export interface UserAuthState {
  user: UserData
  logIn: (user: UserData) => void
  logOut: () => void
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

const useAuthStore = create<UserAuthState>((set) => ({
  user: initialUser,
  logIn: (user) => { set({ user: { isSignIn: true, ...user } }) },
  logOut: () => { set({ user: initialUser }) },
  fetchSession: async () => {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      const parseAuthResult = parseAuthSession(session)

      if (parseAuthResult) set(() => ({ user: parseAuthResult }))
    }).catch((error) => {
      console.error(error)
      toastError({ text: i18next.t('common:messages.error') ?? '', duration: 3000 })
    })
  }
}))

export default useAuthStore
