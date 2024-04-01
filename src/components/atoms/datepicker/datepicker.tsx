import { type FC, memo } from 'react'
import DatepickerTailwind, { type DatepickerType } from 'react-tailwindcss-datepicker'

import { twMerge } from 'tailwind-merge'

export interface DatepickerProps extends DatepickerType {
  name: string
  label?: string
  className?: string
}

const Datepicker: FC<DatepickerProps> = ({ label, name, className, ...datepickerProps }) => (
  <>
    {Boolean(label) && (
      <label htmlFor={name} className="mb-2 block text-sm font-medium leading-6">
        {label}
      </label>
    )}
    <DatepickerTailwind
      primaryColor="violet"
      inputClassName={twMerge(`
        relative
        pl-3
        pr-14
        w-full
        rounded-lg
        border-0
        focus:border-blue-500
        focus:ring-blue-500
        dark:border-gray-600
        dark:bg-gray-700
        dark:text-white
        dark:placeholder:text-gray-400
        dark:focus:border-blue-500'
        'dark:focus:ring-blue-500
        disabled:cursor-not-allowed
        disabled:opacity-50`, className)}
      startWeekOn="mon"
      inputName={name}
      inputId={name}
      {...datepickerProps}
    />
  </>
)

export default memo(Datepicker)
