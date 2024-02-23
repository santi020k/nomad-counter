import { act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { supabase } from '@libs/supabase/supabase'

import { parseAuthSession } from '@utils/auth-session-utils'

import { mockUser } from '@mocks/user.mock'

import useAuthStore, { initialUser } from './use-auth-store'

vi.mock('@libs/supabase/supabase')

// Simplify the complexity of tests regarding code quality
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const parsedMockUser = parseAuthSession(mockUser)!

const logInUser = {
  isSignIn: true,
  ...parsedMockUser
}

describe(
  'useAuthStore Tests',
  () => {
    const { resetState, logIn, logOut, fetchSession } = useAuthStore.getState()

    afterEach(() => {
      resetState()
    })

    it(
      'logIn sets user data',
      () => {
        act(() => {
          logIn(parsedMockUser)
        })

        expect(logInUser).toStrictEqual(useAuthStore.getState().user)
      }
    )

    it(
      'resetState resets user data',
      () => {
        act(() => {
          logIn(parsedMockUser)
        })

        expect(useAuthStore.getState().user).not.toStrictEqual(initialUser)

        act(() => {
          resetState()
        })

        expect(useAuthStore.getState().user).toStrictEqual(initialUser)
      }
    )

    it(
      'logOut resets user data',
      async () => {
        await act(async () => {
          await logOut()
        })

        expect(useAuthStore.getState().user).toStrictEqual(initialUser)
      }
    )

    it(
      'logOut call supabase sign out',
      async () => {
        const signOutSpy = vi.spyOn(
          supabase.auth,
          'signOut'
        )

        await act(async () => {
          await logOut()
        })

        expect(signOutSpy).toHaveBeenCalledTimes(1)
      }
    )

    it(
      'fetchSession sets user data',
      async () => {
        const getSessionSpy = vi.spyOn(
          supabase.auth,
          'getSession'
        )

        getSessionSpy.mockResolvedValue({
          data: { session: mockUser },
          error: null
        })

        await act(async () => {
          await fetchSession()
        })

        expect(useAuthStore.getState().user).toStrictEqual(logInUser)
      }
    )
  }
)
