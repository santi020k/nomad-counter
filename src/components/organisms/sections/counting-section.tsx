import { type FC } from 'react'

import Datepicker from '@atoms/datepicker'
import Input from '@atoms/input'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn } from '@utils/auth-session-utils'
import { t } from '@utils/lang-utils'

const CountingSection: FC = () => {
  const user = useAuthStore((state) => state.user)

  const disabled = !user?.isSignIn

  const handleButton = (): void => {
    if (user?.isSignIn) {
      console.log('temp')
    } else {
      void handleGoogleSignIn()
    }
  }

  return (
    <form className="p-4">
      <div className="space-y-6">
        <h2 className="mt-0 text-base font-semibold leading-7">{t('home:counting.title')}</h2>
        <p className="mt-1 text-sm leading-6">
          {t('home:counting.description')}
        </p>

        {/* Country */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <Input
              className='disabled:cursor-not-allowed disabled:opacity-50'
              name={t('home:counting.country')} required disabled={disabled}
            />
          </div>

          {/* Arrived */}
          <div className="sm:col-span-4">
            <Datepicker name={t('home:counting.arrival')} required disabled={disabled} />
          </div>

          {/* Departed */}
          <div className="sm:col-span-4">
            <Datepicker name={t('home:counting.departure')} required disabled={disabled} />
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-center justify-end gap-x-6">
        <button onClick={handleButton} type="button" className="btn-primary btn">
          {user?.isSignIn ? t('home:counting.action') : t('home:counting.need')}
        </button>
      </div>
    </form>
  )
}

export default CountingSection
