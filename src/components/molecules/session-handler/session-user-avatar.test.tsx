import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, assert, beforeEach, describe, expect, it, vi } from 'vitest'

import useAuthStore from '@store/use-auth-store'

import { parsedMockUser } from '@mocks/user.mock'

import SessionUserAvatar from './session-user-avatar'

const logoutText = 'Logout'

describe('sessionUserAvatar Tests', () => {
  const { resetState, logIn } = useAuthStore.getState()

  beforeEach(() => {
    logIn(parsedMockUser)
  })

  afterEach(() => {
    resetState()
    cleanup()
  })

  it('sessionUserAvatar renders with user shortName', () => {
    render(<SessionUserAvatar logoutText={logoutText} />)
    // Simplify the complexity of Test regarding code quality
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    assert.ok(screen.getByText(parsedMockUser?.shortName as string))
  })

  it('sessionUserAvatar calls logOut when logout link is clicked', async () => {
    const logOutSpy = vi.spyOn(useAuthStore.getState(), 'logOut')
    render(<SessionUserAvatar logoutText={logoutText} />)
    fireEvent.click(screen.getByText(logoutText))
    expect(logOutSpy).toHaveBeenCalledTimes(1)
  })

  it('sessionUserAvatar renders with user initialLetter', () => {
    logIn({ ...parsedMockUser, shortName: undefined })
    render(<SessionUserAvatar logoutText={logoutText} />)
    // Simplify the complexity of Test regarding code quality
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    assert.ok(screen.getByText(parsedMockUser?.initialLetter as string))
  })
})
