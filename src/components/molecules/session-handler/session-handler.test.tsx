import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, assert, describe, expect, test, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import * as authSession from '@utils/auth-session-utils'

import { parsedMockUser } from '@mocks/user.mock'

import SessionHandler from './session-handler'

vi.mock('@libs/supabase/supabase')

describe('SessionHandler Tests', () => {
  const { resetState, logIn } = useAuthStore.getState()

  afterEach(() => {
    resetState()
    cleanup()
  })

  test('SessionHandler calls fetchSession on mount', () => {
    const fetchSession = vi.spyOn(useAuthStore.getState(), 'fetchSession')
    render(<SessionHandler />)
    expect(fetchSession).toBeCalledTimes(1)
  })

  test('SessionHandler calls handleGoogleSignIn when button is clicked', () => {
    const handleGoogleSignInSpy = vi.spyOn(authSession, 'handleGoogleSignIn')
    render(<SessionHandler />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleGoogleSignInSpy).toBeCalledTimes(1)
  })

  test('SessionHandler renders SessionUserAvatar when user is signed in', () => {
    logIn(parsedMockUser)
    render(<SessionHandler logoutText='Logout' />)
    assert.ok(screen.getByText('Logout'))
  })
})
