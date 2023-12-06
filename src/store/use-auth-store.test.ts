import { act } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { supabase } from '@libs/supabase/supabase'

import { type UserData } from '@models/auth-model'

import { parseAuthSession } from '@utils/auth-session-utils'

import { mockUser } from '@mocks/user.mock'

import useAuthStore, { initialUser } from './use-auth-store'

vi.mock('@libs/supabase/supabase')

export const parsedMockUser = parseAuthSession(mockUser) as UserData

const logInUser = {
  isSignIn: true,
  ...parsedMockUser
}

describe('useAuthStore Tests', () => {
  const { resetState, logIn, logOut, fetchSession } = useAuthStore.getState()

  afterEach(() => {
    resetState()
  })

  test('logIn sets user data', () => {
    act(() => {
      logIn(parsedMockUser)
    })

    expect(logInUser).toEqual(useAuthStore.getState().user)
  })

  test('resetState resets user data', () => {
    act(() => {
      logIn(parsedMockUser)
    })

    expect(useAuthStore.getState().user).not.toEqual(initialUser)

    act(() => {
      resetState()
    })

    expect(useAuthStore.getState().user).toEqual(initialUser)
  })

  test('logOut resets user data', async () => {
    await act(async () => {
      await logOut()
    })

    expect(useAuthStore.getState().user).toEqual(initialUser)
  })

  test('logOut call supabase sign out', async () => {
    const signOutSpy = vi.spyOn(supabase.auth, 'signOut')

    await act(async () => {
      await logOut()
    })

    expect(signOutSpy).toBeCalledTimes(1)
  })

  test('fetchSession sets user data', async () => {
    const getSessionSpy = vi.spyOn(supabase.auth, 'getSession')

    getSessionSpy.mockResolvedValue({ data: { session: mockUser }, error: null })

    await act(async () => {
      await fetchSession()
    })

    expect(useAuthStore.getState().user).toEqual(logInUser)
  })
})
