import { type FC } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import type { DateValueType } from 'react-tailwindcss-datepicker'

import Datepicker from '@atoms/datepicker/datepicker'
import Input from '@atoms/input/input'

import useAuthStore from '@store/use-auth-store'

import { handleGoogleSignIn } from '@utils/auth-session-utils'

interface FormCountingSectionProps {
  t: Record<string, string>
}

interface Inputs {
  country: string
  arrival: DateValueType
}

enum InputsNames {
  country = 'country',
  arrival = 'arrival'
}

const FormCountingSection: FC<FormCountingSectionProps> = ({ t }) => {
  const { user } = useAuthStore(state => state)

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Inputs>({
    defaultValues: { arrival: { startDate: null, endDate: null } }
  })

  const onSubmit: SubmitHandler<Inputs> = (data, event) => {
    event?.preventDefault()
    if (user?.isSignIn) {
      console.log(data)
    } else {
      void handleGoogleSignIn()
    }
  }

  console.log(watch(InputsNames.country), watch(InputsNames.arrival))

  const handleForm = (): () => void => handleSubmit(onSubmit)

  return (
    <form className="w-full max-w-4xl p-4" onSubmit={handleForm()}>
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
              required
              placeholder='Colombia'
              disabled={!user?.isSignIn || false}
              label={t?.country ?? InputsNames.country}
              {...register(InputsNames.country, { required: true })}
            />
          </div>

          {/* Dates */}
          <div className="sm:col-span-6">
            <Controller
              control={control}
              name={InputsNames.arrival}
              render={({ field: { onChange, value, name } }) => (
                <Datepicker
                  disabled={!user?.isSignIn || false}
                  name={name}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* TODO: Temporal string fix */}
      {/* eslint-disable-next-line i18next/no-literal-string */}
      {errors.country ? <span>This field is required</span> : null}
      {/* eslint-disable-next-line i18next/no-literal-string */}
      {errors.arrival ? <span>This field is required</span> : null}

      <div className="mt-14 flex items-center justify-end gap-x-6">
        <button type="submit" className="btn-primary btn">
          {user?.isSignIn ? t?.action : t?.need}
        </button>
      </div>
    </form>
  )
}

export default FormCountingSection
