import { type AuthError, type Provider } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supabase } from '@libs/supabase/supabase'
import * as toasts from '@libs/toast-alerts/toast-alert'

import { handleGoogleSignIn, parseAuthSession } from '@utils/auth-session-utils'

import { mockUser, parsedMockUser } from '@mocks/user.mock'

vi.mock('@libs/supabase/supabase')
vi.mock('@libs/toast-alerts/toast-alert')

describe(
  'auth-session-utils',
  () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it(
      'parseAuthSession returns user data',
      () => {
        const result = parseAuthSession(mockUser)
        expect(result).toStrictEqual(parsedMockUser)
      }
    )

    it(
      'parseAuthSession returns undefined for invalid session',
      () => {
        const result = parseAuthSession(undefined)
        expect(result).toBeUndefined()
      }
    )

    it(
      'handleGoogleSignIn calls supabase.auth.signInWithOAuth',
      async () => {
        const signInWithOAuthSpy = vi.spyOn(
          supabase.auth,
          'signInWithOAuth'
        )
        await handleGoogleSignIn()
        expect(signInWithOAuthSpy).toHaveBeenCalledTimes(1)
      }
    )

    it(
      'handleGoogleSignIn calls toastError on error',
      async () => {
        const signInWithOAuthSpy = vi.spyOn(
          supabase.auth,
          'signInWithOAuth'
        )
        const toastErrorSpy = vi.spyOn(
          toasts,
          'toastError'
        )
        const error = new Error() as AuthError
        const data = {
          provider: 'google' as Provider,
          url: null
        }
        signInWithOAuthSpy.mockResolvedValue({
          data,
          error
        })
        await handleGoogleSignIn()
        expect(toastErrorSpy).toHaveBeenCalledTimes(1)
      }
    )
  }
)
