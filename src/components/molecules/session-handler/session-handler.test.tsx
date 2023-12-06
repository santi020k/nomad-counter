import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, assert, describe, expect, test, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import { type UserData } from '@models/auth-model'

import { parseAuthSession } from '@utils/auth-session-utils'
import * as authSession from '@utils/auth-session-utils'

import mockUser from '@mocks/user.mock'

import SessionHandler from './session-handler'

vi.mock('@libs/supabase/supabase')
vi.mock('@utils/auth-session-utils')

const parsedUser = parseAuthSession(mockUser) as UserData

describe('SessionHandler Tests', () => {
  const { result: { current } } = renderHook(() => useAuthStore(state => state))

  afterEach(cleanup)

  test('SessionHandler calls fetchSession on mount', () => {
    const fetchSession = vi.spyOn(current, 'fetchSession')
    render(<SessionHandler />)
    expect(fetchSession).toBeCalledTimes(1)
  })

  test('SessionHandler calls handleGoogleSignIn when button is clicked', () => {
    render(<SessionHandler />)
    const handleGoogleSignInSpy = vi.spyOn(authSession, 'handleGoogleSignIn')
    fireEvent.click(screen.getByRole('button'))
    expect(handleGoogleSignInSpy).toBeCalledTimes(1)
  })

  test('SessionHandler renders SessionUserAvatar when user is signed in', () => {
    current.logIn(parsedUser)
    render(<SessionHandler logoutText='Logout' />)
    assert.ok(screen.getByText('Logout'))
  })
})
