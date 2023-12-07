import { type FC, useEffect, useState } from 'react'

import ItemCountingSection from '@components/organisms/counting-section/item-counting-section'

import { type ListCalculations } from '@libs/supabase/database.types'
import { supabase } from '@libs/supabase/supabase'

const TABLE_NAME = 'list-calculations'

const ListCountingSection: FC = () => {
  const [list, setList] = useState<ListCalculations[] | null>()

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
    <>
      {list?.map((item) => <ItemCountingSection key={item.id} item={item} />)}
    </>
  )
}

export default ListCountingSection
