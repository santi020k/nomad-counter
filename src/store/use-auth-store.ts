import { create } from 'zustand'

import { supabase } from '@libs/supabase'

export type User = {
  isLogIn?: boolean
  name: string
  email: string
}

export type UserAuthState = {
  user: User
  logIn: (user: User) => void
  logOut: () => void
  fetchSession: () => void
}

const useAuthStore = create<UserAuthState>()((set) => ({
  user: {
    isLogIn: false,
    name: '',
    email: '',
  },
  logIn: (user) => set({ user: { isLogIn: true, ...user } }),
  logOut: () => set({ user: { isLogIn: false, name: '', email: '' } }),
  fetchSession: async () => {
    // TODO: temporal logic, code in process
    await supabase.auth.getSession().then(({ data: { session } }) => {
      // setSession(session)
      console.log("🚀 ~ file: auth-store.ts:15 ~ await supabase.auth.getSession ~ session:", session)
      set((state: { user: User }) => ({ user: {...state?.user, ...session } }))
    }).catch((error) => {
      console.log("🚀 ~ file: use-auth-store.ts:32 ~ awaitsupabase.auth.getSession ~ error:", error)
    })
  },
}))

export default useAuthStore
