import { type FC, type ReactElement, useEffect, useState } from 'react'

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

  // TODO: Move this to a new component
  const renderListItem = (item: ListCalculations): ReactElement => (
    <div key={item.id}>
      <p>{item.id}</p>
      <p>{item.country}</p>
      <p>{item.arrival}</p>
      <p>{item.departure}</p>
      <p>{item.created_at}</p>
      <p>{item.updated_at}</p>
    </div>
  )

  return (
    <>
      {list?.map(renderListItem)}
    </>
  )
}

export default ListCountingSection
