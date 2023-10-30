import { useEffect, type FC } from 'react'
import useAuthStore, { type User } from '@store/use-auth-store'
import { supabase } from '@libs/supabase/supabase'

const handleGoogleSignIn = async (): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      skipBrowserRedirect: true,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
  // TODO: Temporal console
  console.log('🚀 ~ file: google-button.tsx:11 ~ handleGoogleSignIn ~ data:', data, error)
}

const GoogleButton: FC = () => {
  const [user, fetchSession, logIn] = useAuthStore((state) => [state.user, state.fetchSession, state.logIn])

  useEffect(() => {
    void fetchSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session !== null) logIn(session as unknown as User)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  if (!(user.isLogIn ?? true)) {
    return (
      <button type="button" onClick={() => handleGoogleSignIn} className="btn btn-primary btn-block">
        Sign in with Google
      </button>
    )
  }

  return (<div>Logged in!</div>)
}

export default GoogleButton
