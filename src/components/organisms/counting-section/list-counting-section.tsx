/* eslint-disable i18next/no-literal-string */
import { type FC, memo, useEffect, useState } from 'react'

import ItemCountingSection from '@organisms/counting-section/item-counting-section'

import { type ListCalculations } from '@libs/supabase/database.types'
import { supabase } from '@libs/supabase/supabase'

const TABLE_NAME = 'list-calculations'

const ListCountingSection: FC = () => {
  const [
    list,
    setList
  ] = useState<ListCalculations[] | null>()

  useEffect(
    () => {
      const getData = async (): Promise<void> => {
        try {
          const { data } = await supabase.from(TABLE_NAME).select('*')
          setList(data)
        } catch (error) {
          console.error(error)
        }
      }
      void getData()
    },
    []
  )

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th/>
            <th>Country</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Total Days</th>
            <th>Last Year Days</th>
            <th>183 Days?</th>
            <th>Residency</th>
          </tr>
        </thead>
        <tbody>
          {/* Residency */}
          <ItemCountingSection
            index={0}
            item={{
              id: 'residency',
              country: 'Residency',
              arrival: '',
              departure: '',
              isResidency: true
            }}
          />
          {/*  */}
          {list?.map((item, index) => <ItemCountingSection key={item.id} index={index + 1} item={item} />)}
        </tbody>
      </table>
    </div>
  )
}

export default memo(ListCountingSection)
