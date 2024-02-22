import { type FC, memo, useEffect } from 'react'

import { IconUser } from '@tabler/icons-react'

import { supabase } from '@libs/supabase/supabase'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn, parseAuthSession } from '@utils/auth-session-utils'

interface SessionHandlerProps {
  logoutText?: string
}

const SessionHandler: FC<SessionHandlerProps> = ({ logoutText }) => {
  const { user, fetchSession, logIn, logOut } = useAuthStore(state => state)

  useEffect(
    () => {
      void fetchSession()

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          const parseAuthResponse = parseAuthSession(session)
          if (parseAuthResponse) logIn(parseAuthResponse)
        }
      }) ?? {}

      const { subscription } = data ?? {}

      return () => {
        subscription?.unsubscribe()
      }
    },
    []
  )

  const handleSession = (): void => {
    if (!user?.isSignIn) {
      void handleGoogleSignIn()
    } else {
      void logOut()
    }
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white
        px-3 py-[10px] text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none
        disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800
        dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      role="button"
      onClick={handleSession}
      id="login-button"
      aria-label="Login button"
    >
      <>
        <IconUser size={18} />
        {!user?.isSignIn
          ? `Log in ${''}`
          : logoutText}
      </>
    </button>
  )
}

export default memo(SessionHandler)
