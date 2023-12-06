import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import { parsedMockUser } from '@mocks/user.mock'

import SessionUserAvatar from './session-user-avatar'

const logoutText = 'Logout'

describe('SessionUserAvatar Tests', () => {
  const { resetState, logIn } = useAuthStore.getState()

  beforeEach(() => {
    logIn(parsedMockUser)
  })

  afterEach(() => {
    resetState()
    cleanup()
  })

  test('SessionUserAvatar renders with user shortName', () => {
    render(<SessionUserAvatar logoutText={logoutText} />)
    assert.ok(screen.getByText(parsedMockUser?.shortName ?? ''))
  })

  test('SessionUserAvatar calls logOut when logout link is clicked', async () => {
    const logOutSpy = vi.spyOn(useAuthStore.getState(), 'logOut')
    render(<SessionUserAvatar logoutText={logoutText} />)
    fireEvent.click(screen.getByText(logoutText))
    expect(logOutSpy).toBeCalledTimes(1)
  })

  test('SessionUserAvatar renders with user initialLetter', () => {
    logIn({ ...parsedMockUser, shortName: undefined })
    render(<SessionUserAvatar logoutText={logoutText} />)
    assert.ok(screen.getByText(parsedMockUser?.initialLetter ?? ''))
  })
})
