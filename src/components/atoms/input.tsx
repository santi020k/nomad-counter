import { type FC } from 'react'

interface InputProps {
  name: string
  label?: string
  required?: boolean
}

const Input: FC<InputProps> = ({ name, label, required }) => (
  <>
    <label htmlFor={name} className="mb-2 block text-sm font-medium leading-6">
      {label ?? name}
    </label>
    <input
      type="text"
      id={name}
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
      focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
      dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder={name}
      name={name}
      required={required}
    />
  </>
)

export default Input
