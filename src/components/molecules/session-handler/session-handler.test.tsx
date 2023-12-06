import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, assert, describe, expect, it, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import * as authSession from '@utils/auth-session-utils'

import { parsedMockUser } from '@mocks/user.mock'

import SessionHandler from './session-handler'

vi.mock('@libs/supabase/supabase')

describe('sessionHandler Tests', () => {
  const { resetState, logIn } = useAuthStore.getState()

  afterEach(() => {
    resetState()
    cleanup()
  })

  it('sessionHandler calls fetchSession on mount', () => {
    const fetchSession = vi.spyOn(useAuthStore.getState(), 'fetchSession')
    render(<SessionHandler />)
    expect(fetchSession).toHaveBeenCalledTimes(1)
  })

  it('sessionHandler calls handleGoogleSignIn when button is clicked', () => {
    const handleGoogleSignInSpy = vi.spyOn(authSession, 'handleGoogleSignIn')
    render(<SessionHandler />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleGoogleSignInSpy).toHaveBeenCalledTimes(1)
  })

  it('sessionHandler renders SessionUserAvatar when user is signed in', () => {
    logIn(parsedMockUser)
    render(<SessionHandler logoutText='Logout' />)
    assert.ok(screen.getByText('Logout'))
  })
})
