import { type FC } from 'react'
import DatepickerTailwind, { type DatepickerType } from 'react-tailwindcss-datepicker'

export interface DatepickerProps extends DatepickerType {
  name: string
  label?: string
}

const Datepicker: FC<DatepickerProps> = ({ label, placeholder, name, disabled, value, onChange, ...restProps }) => (
  <>
    <label htmlFor={name} className="mb-2 block text-sm font-medium leading-6">
      {label ?? name}
    </label>
    <DatepickerTailwind
      primaryColor="violet"
      inputClassName="
        relative pl-3 pr-14 w-full rounded-lg border focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600
        dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500
        dark:focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      startWeekOn="mon"
      inputName={name}
      inputId={name}
      disabled={disabled ?? false}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? ''}
      {...restProps}
    />
  </>
)

export default Datepicker
