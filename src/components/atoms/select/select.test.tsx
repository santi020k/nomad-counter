import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Select from './select'

describe('select component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3']
  const onChange = vi.fn()

  it('renders select options correctly', () => {
    const { getByLabelText, getByDisplayValue } = render(
      <Select
        name="test"
        onChange={onChange}
        options={options}
        label="Test Label"
        value="Option 2"
      />
    )
    const selectElement = getByLabelText('Test Label')

    expect(selectElement).toBeInTheDocument()

    expect(getByDisplayValue('Option 2')).toBeInTheDocument()
  })

  it('triggers onChange handler correctly', () => {
    const { getByLabelText } = render(
      <Select
        name="test"
        onChange={onChange}
        options={options}
        label="Test Label"
      />
    )
    const selectElement = getByLabelText('Test Label')

    fireEvent.change(selectElement, { target: { selectedIndex: 1 } })

    expect(onChange).toHaveBeenCalledWith('Option 2')
  })

  it('displays error message correctly', () => {
    const { getByText } = render(
      <Select
        name="test"
        onChange={onChange}
        options={options}
        label="Test Label"
        isError
        message="Error message"
      />
    )

    expect(getByText('Error message')).toBeInTheDocument()
  })

  it('displays success message correctly', () => {
    const { getByText } = render(
      <Select
        name="test"
        onChange={onChange}
        options={options}
        label="Test Label"
        isSuccess
        message="Success message"
      />
    )

    expect(getByText('Success message')).toBeInTheDocument()
  })

  // Add more test cases as needed
})
