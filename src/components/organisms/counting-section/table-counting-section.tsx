/* eslint-disable react/jsx-max-depth */
/* eslint-disable i18next/no-literal-string */
import { type FC, memo, useEffect, useState } from 'react'

import ItemCountingSection from '@organisms/counting-section/item-counting-section'

import { type ListCalculations } from '@libs/supabase/database.types'
import { supabase } from '@libs/supabase/supabase'

import HeadCountingSection from './head-counting-section'

const TABLE_NAME = 'list-calculations'

const ListCountingSection: FC = () => {
  const [
    list,
    setList
  ] = useState<ListCalculations[] | null>()

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        const { data } = await supabase.from(TABLE_NAME).select('*')

        setList(data)
      } catch (error) {
        console.error(error)
      }
    }

    void getData()
  }, [])

  return (
    <div className="flex max-w-full flex-col p-8">
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <HeadCountingSection />
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <ItemCountingSection
                  item={{
                    id: 'residency',
                    country: 'Residency',
                    arrival: '',
                    departure: '',
                    isResidency: true
                  }}
                />
                {/*  */}
                {list?.map(item => <ItemCountingSection key={item.id} item={item} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ListCountingSection)
