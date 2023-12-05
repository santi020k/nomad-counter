import { type FC, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

const Input: FC<InputProps> = ({ name, label, className, ...restProps }) => (
  <>
    <label htmlFor={name} className="mb-2 block text-sm font-medium leading-6">
      {label ?? name}
    </label>
    <input
      type="text"
      id={name}
      className={[
        'block w-full rounded-lg border focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600',
        'dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 ',
        'dark:focus:ring-blue-500',
        className
      ].join(' ')}
      placeholder={name}
      name={name}
      {...restProps}
    />
  </>
)

export default Input
