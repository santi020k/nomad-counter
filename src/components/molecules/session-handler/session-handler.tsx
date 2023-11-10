import { type FC, type ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { supabase } from '@libs/supabase/supabase'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn, handleSignOut, parseAuthSession } from '@utils/auth-session-utils'

interface SessionHandlerProps {
  UserIcon?: ReactElement
}

const SessionHandler: FC<SessionHandlerProps> = ({ UserIcon }) => {
  const { t } = useTranslation()
  const [user, fetchSession, logIn, logOut] =
    useAuthStore((state) => [state.user, state.fetchSession, state.logIn, state.logOut])

  useEffect(() => {
    void fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const parseAuthResponse = parseAuthSession(session)
      if (parseAuthResponse) logIn(parseAuthResponse)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (!user.isSignIn) {
    return (
      <button
        type="button"
        onClick={() => { void handleGoogleSignIn() }}
        className="btn btn-block rounded-full"
        aria-label="Login button"
      >
        <i className="ti ti-user text-xl" />
      </button>
    )
  }

  return (
    <div className="dropdown sm:dropdown-end">
      <label tabIndex={0} className="avatar placeholder btn btn-circle btn-ghost">
        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
          <span>{user?.shortName || user?.initialLetter || UserIcon}</span>
        </div>
      </label>
      <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow">
        {/* TODO: Coming soon  */}
        {/* <li><a>Profile</a></li> */}
        {/* <li><a>Settings</a></li> */}
        <li><a onClick={() => { void handleSignOut({ logOut }) }}>{t('common:messages.auth.logout')}</a></li>
      </ul>
    </div>
  )
}

export default SessionHandler
