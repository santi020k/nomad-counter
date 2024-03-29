import toastify from 'toastify-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toastAlert, toastError, toastSuccess } from './toast-alert'

vi.mock('toastify-js')

describe('toast-alert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toastAlert calls Toastify with correct parameters', () => {
    const params = { text: 'Test Alert' }
    toastAlert(params)
    expect(toastify).toHaveBeenCalledWith(expect.objectContaining({
      ...params,
      gravity: 'bottom',
      position: 'right',
      close: true,
      className: 'alert'
    }))
  })

  it('toastSuccess calls toastAlert with correct parameters', () => {
    const params = { text: 'Test Success' }
    toastSuccess(params)
    expect(toastify).toHaveBeenCalledWith(expect.objectContaining({
      ...params,
      className: 'alert alert-success'
    }))
  })

  it('toastError calls toastAlert with correct parameters', () => {
    const params = { text: 'Test Error' }
    toastError(params)
    expect(toastify).toHaveBeenCalledWith(expect.objectContaining({
      ...params,
      className: 'alert alert-error'
    }))
  })
})
