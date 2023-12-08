import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

export type Ref = HTMLInputElement

const Input = forwardRef<Ref, InputProps>(({ name, label, className, placeholder, ...restProps }, ref) => (
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
      placeholder={placeholder ?? name}
      name={name}
      ref={ref}
      {...restProps}
    />
  </>
))

Input.displayName = 'Input'

export default Input
