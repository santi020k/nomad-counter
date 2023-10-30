import { useEffect, type FC, type ReactElement } from 'react'
import useAuthStore, { type User } from '@store/use-auth-store'
import { supabase } from '@libs/supabase/supabase'

interface SessionHandlerProps {
  googleIcon?: ReactElement
}

const handleGoogleSignIn = async (): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
  // TODO: Temporal console
  console.log('🚀 ~ file: google-button.tsx:11 ~ handleGoogleSignIn ~ data:', data, error)
}

const handleSignOut = async ({ logOut }: { logOut: () => void }): Promise<void> => {
  await supabase.auth.signOut().then(({ error }) => {
    if (!error) logOut()
  })
}

const SessionHandler: FC<SessionHandlerProps> = ({ googleIcon }) => {
  const [user, fetchSession, logIn, logOut] =
    useAuthStore((state) => [state.user, state.fetchSession, state.logIn, state.logOut])

  useEffect(() => {
    void fetchSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session !== null) {
        logIn(session as unknown as User)
      }
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (!(user.isLogIn ?? true)) {
    return (
      <button type="button" onClick={() => { void handleGoogleSignIn() }} className="btn btn-block">
        {googleIcon} Sign in
      </button>
    )
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
          <span>SM</span>
        </div>
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Profile</a></li>
        <li><a>Settings</a></li>
        <li><a onClick={() => { void handleSignOut({ logOut }) }}>Logout</a></li>
      </ul>
    </div>
  )
}

export default SessionHandler
