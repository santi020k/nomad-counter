import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import { type UserData } from '@models/auth-model'

import { parseAuthSession } from '@utils/auth-session-utils'

import mockUser from '@mocks/user.mock'

import SessionUserAvatar from './session-user-avatar'

const parsedUser = parseAuthSession(mockUser) as UserData

const logoutText = 'Logout'

describe('SessionUserAvatar Tests', () => {
  const { result: { current } } = renderHook(() => useAuthStore(state => state))
  const logOutSpy = vi.spyOn(current, 'logOut')

  beforeEach(() => {
    current.logIn(parsedUser)
    render(<SessionUserAvatar logoutText={logoutText} />)
  })

  afterEach(() => {
    logOutSpy.mockReset()
    cleanup()
  })

  test('SessionUserAvatar renders with user shortName', () => {
    assert.ok(screen.getByText(parsedUser?.shortName ?? ''))
  })

  test('SessionUserAvatar calls logOut when logout link is clicked', async () => {
    fireEvent.click(screen.getByText(logoutText))
    expect(logOutSpy).toBeCalledTimes(1)
  })

  test('SessionUserAvatar renders with user initialLetter', () => {
    cleanup()
    current.logIn({ ...parsedUser, shortName: undefined })
    render(<SessionUserAvatar logoutText={logoutText} />)
    assert.ok(screen.getByText(parsedUser?.initialLetter ?? ''))
  })
})
