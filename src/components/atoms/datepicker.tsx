/* eslint-disable react/no-unknown-property */
import { type FC } from 'react'

import { Datepicker as DatepickerFlow } from 'flowbite-react'

interface DatepickerProps {
  name: string
  label?: string
  required?: boolean
}

const datepickerTheme = {
  popup: {
    footer: {
      button: {
        base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-primary/30',
        today: 'bg-primary text-white hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary'
      }
    }
  },
  views: {
    days: { items: { item: { selected: 'bg-primary text-white hover:bg-primary/80' } } },
    months: { items: { item: { selected: 'bg-primary text-white hover:bg-primary/80' } } },
    years: { items: { item: { selected: 'bg-primary text-white hover:bg-primary/80' } } },
    decades: { items: { item: { selected: 'bg-primary text-white hover:bg-primary/80' } } }
  }
}

const Datepicker: FC<DatepickerProps> = ({ name, label, required }) => (
  <>
    <label htmlFor={name} className="mb-2 block text-sm font-medium leading-6">
      {label ?? name}
    </label>
    <DatepickerFlow
      name={name}
      required={required ?? false}
      theme={datepickerTheme}
    />
  </>
)

export default Datepicker
