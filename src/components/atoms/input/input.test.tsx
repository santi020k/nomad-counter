import { faker } from '@faker-js/faker'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, assert, beforeEach, describe, expect, it, vi } from 'vitest'

import Input, { type InputProps } from './input'

let defaultProps: InputProps
const onChange = vi.fn()

// Fake
const inputValue = faker.lorem.word()
const inputPlaceholder = 'Enter text'
const inputName = 'testName'
const inputId = 'testId'

describe(
  'input Tests',
  () => {
    beforeEach(() => {
      onChange.mockReset()
      defaultProps = {
        name: inputName,
        id: inputId,
        onChange
      }
    })

    afterEach(() => {
      cleanup()
    })

    it(
      'input changes value when text is entered',
      async () => {
        render(<Input {...defaultProps} />)
        const user = userEvent.setup()
        const input: HTMLInputElement = screen.getByTestId(inputId)
        await user.type(
          input,
          inputValue
        )
        assert.equal(
          input.value,
          inputValue
        )
      }
    )

    it(
      'input calls onChange when text is entered',
      async () => {
        render(<Input {...defaultProps} />)
        const user = userEvent.setup()
        const input: HTMLInputElement = screen.getByTestId(inputId)
        await user.type(
          input,
          inputValue
        )
        expect(onChange).toHaveBeenCalledTimes(inputValue.length)
      }
    )

    it(
      'input renders with provided placeholder',
      () => {
        render(<Input {...defaultProps} placeholder={inputPlaceholder} />)
        assert.ok(screen.getByPlaceholderText(inputPlaceholder))
      }
    )
  }
)
