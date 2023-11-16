import { type FC, useState } from 'react'

import Datepicker, { type DateValueType } from '@atoms/datepicker'
import Input from '@atoms/input'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn } from '@utils/auth-session-utils'

interface CountingSectionProps {
  t: Record<string, string>
}

const CountingSection: FC<CountingSectionProps> = ({ t }) => {
  const user = useAuthStore((state) => state.user)
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null
  })

  const disabled = !user?.isSignIn

  const handleButton = (): void => {
    if (user?.isSignIn) {
      console.log('temp')
    } else {
      void handleGoogleSignIn()
    }
  }

  const handleValueChange = (newValue: DateValueType): void => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  return (
    <form className="w-full max-w-4xl p-4">
      <div className="space-y-6">
        <div className="w-full">
          <h2 className="
            mt-0 inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text
            text-base font-semibold leading-7 text-transparent"
          >
            # {t.subtitle}
          </h2>
          <h3>{t.title}</h3>
          <p className="mt-1 text-sm leading-6">{t.description}.</p>
        </div>

        {/* Country */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Input
              className='disabled:cursor-not-allowed disabled:opacity-50'
              name={t?.country ?? ''}
              required
              disabled={disabled}
            />
          </div>

          {/* Dates */}
          <div className="sm:col-span-6">
            <Datepicker
              name={t?.arrival ?? ''}
              required disabled={disabled}
              value={value}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-center justify-end gap-x-6">
        <button onClick={handleButton} type="button" className="btn-primary btn">
          {user?.isSignIn ? t?.action : t?.need}
        </button>
      </div>
    </form>
  )
}

export default CountingSection
