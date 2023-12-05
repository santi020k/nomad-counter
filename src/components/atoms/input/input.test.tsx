import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { assert, beforeEach, expect, test, vi } from 'vitest'

import Input, { type InputProps } from './input'

let defaultProps: InputProps
const onChange = vi.fn()

// Fake
const inputValue = 'Test input'
const inputLabel = 'Test Label'
const inputPlaceholder = 'Enter text'
const inputName = 'test'

beforeEach(() => {
  onChange.mockReset()
  defaultProps = {
    name: inputName,
    onChange
  }
})

test('Input renders with provided label', () => {
  render(<Input {...defaultProps} label={inputLabel} />)
  assert.ok(screen.getByLabelText(inputLabel))
})

test('Input renders with name as label if no label is provided', () => {
  render(<Input {...defaultProps} />)
  assert.ok(screen.getByLabelText(inputName))
})

test('Input changes value when text is entered', async () => {
  render(<Input {...defaultProps} />)
  const user = userEvent.setup()
  const input: HTMLInputElement = screen.getByLabelText(inputName)
  await user.type(input, inputValue)
  assert.equal(input.value, inputValue)
})

test('Input calls onChange when text is entered', async () => {
  render(<Input {...defaultProps} />)
  const user = userEvent.setup()
  const input: HTMLInputElement = screen.getByLabelText(inputName)
  await user.type(input, inputValue)
  expect(onChange).toBeCalledTimes(inputValue.length)
})

test('Input does not call onChange when disabled', async () => {
  render(<Input {...defaultProps} disabled />)
  const user = userEvent.setup()
  const input: HTMLInputElement = screen.getByLabelText(inputName)
  await user.type(input, inputValue)
  expect(onChange).toBeCalledTimes(0)
})

test('Input renders with provided placeholder', () => {
  render(<Input {...defaultProps} placeholder={inputPlaceholder} />)
  assert.ok(screen.getByPlaceholderText(inputPlaceholder))
})
