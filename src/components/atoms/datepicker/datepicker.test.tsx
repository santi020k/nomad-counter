import { faker } from '@faker-js/faker'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest'

import Datepicker, { type DatepickerProps } from './datepicker'

const defaultValues = {
  startDate: '',
  endDate: ''
}

let defaultProps: DatepickerProps
const onChange = vi.fn()

// Fake
const inputValue = '2024-01-08 ~ 2024-01-18'
const inputLabel = faker.lorem.word()
const inputPlaceholder = 'Enter text'
const inputName = 'test'

describe('Datepicker Tests', () => {
  beforeEach(() => {
    onChange.mockReset()
    defaultProps = {
      name: 'test',
      onChange,
      value: defaultValues
    }
  })

  afterEach(() => {
    cleanup()
  })

  test('Datepicker renders with provided label', () => {
    render(<Datepicker {...defaultProps} label={inputLabel} />)
    assert.ok(screen.getByLabelText(inputLabel))
  })

  test('Datepicker renders with name as label if no label is provided', () => {
    render(<Datepicker {...defaultProps} />)
    assert.ok(screen.getByLabelText(inputName))
  })

  test('Datepicker changes value when a date is selected', async () => {
    render(<Datepicker {...defaultProps} />)
    const user = userEvent.setup()
    const input: HTMLInputElement = screen.getByLabelText(inputName)
    await user.type(input, inputValue)
    assert.equal(input.value, inputValue)
    expect(onChange).toHaveBeenCalled()
  })

  test('Datepicker renders with provided placeholder', () => {
    render(<Datepicker {...defaultProps} placeholder={inputPlaceholder} />)
    assert.ok(screen.getByPlaceholderText(inputPlaceholder))
  })
})
