import { type FC, type ReactElement, useEffect } from 'react'

import { t } from '@libs/i18n/i18n'
import { supabase } from '@libs/supabase/supabase'
import { toastError } from '@libs/toast-alerts/toast-alert'

import useAuthStore from '@store/use-auth-store'

import { parseAuthSession } from '@utils/parse-auth-session'

interface SessionHandlerProps {
  UserIcon?: ReactElement
}

const handleGoogleSignIn = async (): Promise<void> => {
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
  if (error) toastError({ text: t('messages.error') ?? '', duration: 3000 })
}

const handleSignOut = async ({ logOut }: { logOut: () => void }): Promise<void> => {
  await supabase.auth.signOut().then(({ error }) => {
    if (!error) logOut()
  })
}

const SessionHandler: FC<SessionHandlerProps> = ({ UserIcon }) => {
  const [user, fetchSession, logIn, logOut] =
    useAuthStore((state) => [state.user, state.fetchSession, state.logIn, state.logOut])

  useEffect(() => {
    void fetchSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const parseAuthResponse = parseAuthSession(session)
      if (session !== null && parseAuthResponse) logIn(parseAuthResponse)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (!(user.isSignIn ?? true)) {
    return (
      <button
        type="button"
        onClick={() => { void handleGoogleSignIn() }}
        className="btn btn-block rounded-full"
        aria-label="Login button"
      >
        {UserIcon}
      </button>
    )
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
          <span>{user?.shortName || user?.initialLetter || UserIcon}</span>
        </div>
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {/* TODO: Coming soon  */}
        {/* <li><a>Profile</a></li> */}
        {/* <li><a>Settings</a></li> */}
        <li><a onClick={() => { void handleSignOut({ logOut }) }}>{t('messages.auth.logout')}</a></li>
      </ul>
    </div>
  )
}

export default SessionHandler
