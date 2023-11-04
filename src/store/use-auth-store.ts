import { create } from 'zustand'

import { t } from '@libs/i18n/i18n'
import { supabase } from '@libs/supabase/supabase'
import { toastError, toastSuccess } from '@libs/toast-alerts/toast-alert'

import { type UserData, UserDataSchema } from '@models/auth-model'

import { parseAuthSession } from '@utils/parseAuthSession'

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

const useAuthStore = create<UserAuthState>()((set) => ({
  user: initialUser,
  logIn: (user) => { set({ user: { isSignIn: true, ...user } }) },
  logOut: () => { set({ user: initialUser }) },
  fetchSession: async () => {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      const parseAuthResult = parseAuthSession(session)

      if (parseAuthResult) {
        set(() => ({
          user: parseAuthResult
        }))
        toastSuccess({ text: t('common:messages.auth.success') ?? '', duration: 3000000 })
      }
    }).catch((error) => {
      console.error(error)
      toastError({ text: t('common:messages.error') ?? '', duration: 3000 })
    })
  }
}))

export default useAuthStore
