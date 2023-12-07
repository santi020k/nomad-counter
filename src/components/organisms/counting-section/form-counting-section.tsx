import { type FC, type MouseEvent } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import type { DateValueType } from 'react-tailwindcss-datepicker'

import Datepicker from '@atoms/datepicker/datepicker'
import Input from '@atoms/input/input'

import { supabase } from '@libs/supabase/supabase'

import useAuthStore from '@store/use-auth-store'

import { CountingFormSchema } from '@models/counting-form-model'

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

  const { register, handleSubmit, control, setError, formState: { errors } } = useForm<Inputs>({
    // TODO: In future versions, this will be the default behavior setting in user account.
    // defaultValues: { arrival: { startDate: null, endDate: null } }
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.arrival?.endDate || !data.arrival?.startDate) {
      setError(InputsNames.arrival, {
        type: 'manual',
        message: 'This field is required'
      })
      return
    }
    const result = CountingFormSchema.safeParse(data)
    if (result.success) {
      const { data, error } = await supabase
        .from('list-calculations')
        .insert([
          {
            country: result.data.country,
            arrival: result.data.arrival.startDate,
            departure: result.data.arrival.endDate
          }
        ])
        .select()
      // TODO: Handle error
      console.log('🚀 ~ file: form-counting-section.tsx:54 ~ data, error:', data, error)
    } else {
      result.error.issues.forEach(issue => {
        setError(issue.path[0] as keyof Inputs, {
          type: 'manual',
          message: issue.message
        })
      })
    }
  }

  const handleForm = (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault()
    if (user?.isSignIn) {
      void handleSubmit(onSubmit)()
    } else {
      void handleGoogleSignIn()
    }
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
              required
              placeholder='Colombia'
              disabled={!user?.isSignIn || false}
              label={t?.country ?? InputsNames.country}
              {...register(InputsNames.country, { required: true })}
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            {errors.country ? <span>This field is required</span> : null}
          </div>

          {/* Dates */}
          <div className="sm:col-span-6">
            <Controller
              control={control}
              name={InputsNames.arrival}
              rules={{ required: true }}
              render={({ field: { onChange, value, name } }) => (
                <Datepicker
                  disabled={!user?.isSignIn || false}
                  name={name}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {/* eslint-disable-next-line i18next/no-literal-string */}
            {errors.arrival ? <span>This field is required</span> : null}
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-center justify-end gap-x-6">
        <button type="submit" onClick={handleForm} className="btn-primary btn">
          {user?.isSignIn ? t?.action : t?.need}
        </button>
      </div>
    </form>
  )
}

export default FormCountingSection
