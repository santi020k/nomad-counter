import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import * as authSession from '@utils/auth-session-utils'

import SessionHandler from './session-handler'

vi.mock('@libs/supabase/supabase')

// const logoutText = 'Logout'

describe(
  'sessionHandler Tests',
  () => {
    const { resetState } = useAuthStore.getState()

    afterEach(() => {
      resetState()
      cleanup()
    })

    it(
      'sessionHandler calls fetchSession on mount',
      () => {
        const fetchSession = vi.spyOn(
          useAuthStore.getState(),
          'fetchSession'
        )
        render(<SessionHandler />)
        expect(fetchSession).toHaveBeenCalledTimes(1)
      }
    )

    it(
      'sessionHandler calls handleGoogleSignIn when button is clicked',
      () => {
        const handleGoogleSignInSpy = vi.spyOn(
          authSession,
          'handleGoogleSignIn'
        )
        render(<SessionHandler />)
        fireEvent.click(screen.getByRole('button'))
        expect(handleGoogleSignInSpy).toHaveBeenCalledTimes(1)
      }
    )

    // TODO: Pending update test
    // it.skip(
    //   'sessionUserAvatar calls logOut when logout link is clicked',
    //   async () => {
    //     const logOutSpy = vi.spyOn(
    //       useAuthStore.getState(),
    //       'logOut'
    //     )
    //     render(<SessionHandler logoutText={logoutText} />)
    //     fireEvent.click(screen.getByRole('button'))
    //     expect(logOutSpy).toHaveBeenCalledTimes(1)
    //   }
    // )
  }
)
