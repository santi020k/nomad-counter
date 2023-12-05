import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { assert, beforeEach, expect, test, vi } from 'vitest'

import Datepicker, { type DatepickerProps } from './datepicker'

const defaultValues = {
  startDate: '',
  endDate: ''
}

let defaultProps: DatepickerProps
const onChange = vi.fn()

beforeEach(() => {
  onChange.mockReset()
  defaultProps = {
    name: 'test',
    onChange,
    value: defaultValues
  }
})

test('Datepicker renders with provided label', () => {
  render(<Datepicker label="Test Label" {...defaultProps} />)
  assert.ok(screen.getByLabelText('Test Label'))
})

test('Datepicker renders with name as label if no label is provided', () => {
  render(<Datepicker {...defaultProps} />)
  assert.ok(screen.getByLabelText('test'))
})

test('Datepicker changes value when a date is selected', async () => {
  render(<Datepicker {...defaultProps} />)
  const user = userEvent.setup()
  const input: HTMLInputElement = screen.getByLabelText('test')
  await user.type(input, '2024-01-08 ~ 2024-01-18')
  assert.equal(input.value, '2024-01-08 ~ 2024-01-18')
  expect(onChange).toBeCalledTimes(1)
})
