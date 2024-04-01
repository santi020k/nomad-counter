import { type FC, memo, type MouseEvent } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import type { DateValueType } from 'react-tailwindcss-datepicker'

import { countries } from 'countries-list'

import Datepicker from '@atoms/datepicker/datepicker'
import Select from '@atoms/select/select'

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
  const { handleSubmit, control, setError, formState: { errors } } = useForm<Inputs>({
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
      <div className="inline-flex flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-sm font-semibold leading-tight tracking-tight text-gray-600">
            # {t.subtitle}
          </div>
          <div className="max-w-[614px] self-stretch text-center">
            <span className="text-4xl font-bold tracking-tight text-black">
              {t.title}&nbsp;
            </span>
            <span className="text-4xl font-bold tracking-tight text-violet-900">
              {t.every}
            </span>
          </div>
          <div
            className=
              "max-w-[700px] self-stretch text-center text-base font-normal leading-normal tracking-tight text-gray-500"
          >
            {t.description}
          </div>
        </div>
        <div
          className="
            flex flex-col items-end justify-end gap-2.5 self-stretch rounded-lg border border-gray-300 bg-white
            p-4 shadow-xl lg:flex-row lg:items-center"
        >
          <div
            className=
              "flex w-full shrink grow flex-col items-start justify-start lg:flex-row lg:items-center lg:gap-4"
          >
            <div className="flex h-[62px] w-full shrink grow flex-col items-start justify-center">
              <Controller
                control={control}
                name={InputsNames.country}
                rules={{ required: true }}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    disabled={!user?.isSignIn}
                    onChange={onChange}
                    value={value ?? ''}
                    name={name}
                    options={Object.values(countries).map(country => country.name)}
                    isError={Boolean(errors.country)}
                    message={`This field is required ${''}`}
                    className='w-full'
                  />
                )}
              />
            </div>
            <div className="flex h-[62px] w-full shrink grow flex-col items-start justify-center">
              <Controller
                control={control}
                name={InputsNames.dates}
                rules={{ required: true }}
                render={({ field: { onChange, value, name } }) => (
                  <Datepicker
                    disabled={!user?.isSignIn}
                    name={name}
                    label=""
                    onChange={onChange}
                    value={value}
                    className="shrink grow text-[15px] font-medium tracking-tight text-gray-500"
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
              className="flex items-center justify-center gap-2.5 rounded-lg bg-violet-900 px-[20px] py-[22px]"
            >
              <span
                className="
                  whitespace-nowrap text-center text-[15px] font-semibold leading-normal tracking-tight text-white"
              >
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
