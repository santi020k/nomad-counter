import { type FC, memo, type MouseEvent } from 'react'
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
  dates: DateValueType
}

enum InputsNames {
  country = 'country',
  dates = 'dates'
}

const FormCountingSection: FC<FormCountingSectionProps> = ({ t }) => {
  const { user } = useAuthStore(state => state)

  const { register, handleSubmit, control, setError, formState: { errors } } = useForm<Inputs>({
    // TODO: In future versions, this will be the default behavior setting in user account.
    // defaultValues: { dates: { startDate: null, endDate: null } }
  })

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (!data.dates?.endDate || !data.dates?.startDate) {
      setError(InputsNames.dates, {
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
            arrival: result.data.dates.startDate,
            departure: result.data.dates.endDate
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
      {/* New */}
      <div className="inline-flex max-w-[400px] flex-col items-center justify-center gap-8 p-4">
        <div className="flex h-[344px] flex-col items-center justify-center gap-6 self-stretch">
          <div className="text-sm font-semibold leading-tight tracking-tight text-gray-600">
            # {t.subtitle}
          </div>
          <div className="self-stretch text-center">
            <span className="text-4xl font-bold tracking-tight text-black">
              {t.title}&nbsp;
            </span>
            <span className="text-4xl font-bold tracking-tight text-violet-900">
              {t.every}
            </span>
          </div>
          <div className="self-stretch text-center text-base font-normal leading-normal tracking-tight text-gray-500">
            {t.description}
          </div>
        </div>
        <div
          className="
            inline-flex items-end justify-end gap-2.5 self-stretch rounded-lg border
            border-gray-300 bg-white p-4 shadow"
        >
          <div className="flex h-[124px] shrink grow basis-0 items-start justify-start">
            <div
              className="
                inline-flex shrink grow basis-0 flex-col items-start justify-start
                border-r border-gray-300"
            >
              <Input
                className="
                  shrink grow basis-0 text-sm font-medium text-gray-500 disabled:cursor-not-allowed disabled:opacity-50
                "
                required
                placeholder="Colombia"
                disabled={!user?.isSignIn || false}
                label={t?.country ?? InputsNames.country}
                {...register(InputsNames.country, { required: true })}
              />
              {errors.country
                ? <span>{`This field is required ${''}`}</span>
                : null}
            </div>
            <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start">
              <Controller
                control={control}
                name={InputsNames.dates}
                rules={{ required: true }}
                render={({ field: { onChange, value, name } }) => (
                  <Datepicker
                    disabled={!user?.isSignIn || false}
                    name={name}
                    label=""
                    onChange={onChange}
                    value={value}
                    className="shrink grow basis-0 text-[15px] font-medium tracking-tight text-gray-500"
                  />
                )}
              />
              {errors.dates
                ? <span>{`This field is required ${''}`}</span>
                : null}
            </div>
          </div>
          <div className="flex items-start justify-start">
            <button
              onClick={handleForm}
              type="submit"
              className="flex items-center justify-center gap-2.5 rounded-lg bg-violet-900 px-5 py-[22px]"
            >
              <span className="text-center text-[15px] font-semibold tracking-tight text-white">
                {user?.isSignIn
                  ? t?.action
                  : t?.need}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(FormCountingSection)
