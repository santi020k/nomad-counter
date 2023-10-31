import { create } from 'zustand'

import { supabase } from '@libs/supabase/supabase'
import { toastSuccess, toastError } from '@libs/toast-alerts/toast-alert'

import { parseAuthSession } from '@utils/parseAuthSession'

import { UserDataSchema, type UserData } from '@models/auth-model'

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
        toastSuccess({ text: 'Sign In Success', duration: 3000 })
      }
    }).catch((error) => {
      console.error(error)
      toastError({ text: 'something went wrong', duration: 3000 })
    })
  }
}))

export default useAuthStore
