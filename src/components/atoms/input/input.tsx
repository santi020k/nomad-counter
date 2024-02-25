import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

export type Ref = HTMLInputElement

const Input = forwardRef<Ref, InputProps>(({ name, className, placeholder, id, ...restProps }, ref) => (
  <input
    type="text"
    className={[
      'block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500',
      'focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700',
      'dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600',
      className
    ].join(' ')}
    placeholder={placeholder ?? name}
    name={name}
    ref={ref}
    data-testid={id}
    id={id}
    {...restProps}
  />
))

Input.displayName = 'Input'

export default Input
