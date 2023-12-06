import { faker } from '@faker-js/faker'
import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, assert, describe, expect, test, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import { parseAuthSession } from '@utils/auth-session-utils'
import * as authSession from '@utils/auth-session-utils'

import SessionHandler from './session-handler'

vi.mock('@libs/supabase/supabase')
vi.mock('@utils/auth-session-utils')

const defaultUser = {
  isSignIn: true,
  email: faker.internet.email(),
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
  shortName: faker.person.firstName(),
  initialLetter: faker.person.firstName()
}

const parsedUser = parseAuthSession(defaultUser) ?? defaultUser

describe('SessionHandler Tests', () => {
  afterEach(cleanup)

  const { result: { current } } = renderHook(() => useAuthStore(state => state))

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
