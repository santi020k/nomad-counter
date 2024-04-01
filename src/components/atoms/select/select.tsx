/* eslint-disable i18next/no-literal-string */
import { type ChangeEvent, type FC, type SelectHTMLAttributes } from 'react'

import { twMerge } from 'tailwind-merge'

type Value = string | number

type HTMLSelect = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>

interface SelectProps<Value> extends HTMLSelect {
  onChange: (newValue?: Value) => void
  options: readonly Value[]
  name: string
  isError?: boolean
  isSuccess?: boolean
  message?: string
  label?: string
  className?: string
}

const Select: FC<SelectProps<Value>> = ({
  onChange, options, isSuccess, isError, message, label, className, name, ...selectProps
}) => {
  const selectClasses = `
    py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500
    disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
    dark:focus:ring-gray-600
  `
  const errorClasses = isError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
  const successClasses = isSuccess && 'border-green-500 focus:border-teal-500 focus:ring-teal-500'

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(options[event.target.selectedIndex])
  }

  return (
    <div className="cursor-pointer">
      {Boolean(label) && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="relative cursor-pointer">
        <select
          id={name}
          name={name}
          className={
            twMerge(selectClasses, className, errorClasses, successClasses, 'cursor-pointer')
          }
          onChange={handleChange}
          {...selectProps}
        >
          {options.map(value => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {Boolean(isError ?? isSuccess) && (
        <p className={twMerge('mt-2 text-sm', isError && 'text-red-600', isSuccess && 'text-teal-600')}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Select
