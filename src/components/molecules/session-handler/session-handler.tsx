import { type FC, useEffect } from 'react'

import { IconUser } from '@tabler/icons-react'

import { supabase } from '@libs/supabase/supabase'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn, parseAuthSession } from '@utils/auth-session-utils'

import SessionUserAvatar from './session-user-avatar'

interface SessionHandlerProps {
  logoutText?: string
}

const SessionHandler: FC<SessionHandlerProps> = ({ logoutText }) => {
  const { user, fetchSession, logIn } = useAuthStore(state => state)

  useEffect(() => {
    void fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const parseAuthResponse = parseAuthSession(session)
      if (parseAuthResponse) logIn(parseAuthResponse)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (!user?.isSignIn) {
    return (
      <button
        type="button"
        onClick={() => { void handleGoogleSignIn() }}
        className="btn btn-block rounded-full"
        aria-label="Login button"
      >
        <IconUser size={18} />
      </button>
    )
  }

  return <SessionUserAvatar logoutText={logoutText ?? ''} />
}

export default SessionHandler
