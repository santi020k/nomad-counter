import { type FC, useEffect, useState } from 'react'

import { type ListCalculations } from '@libs/supabase/database.types'
import { supabase } from '@libs/supabase/supabase'

const ListCountingSection: FC = () => {
  const [list, setList] = useState<ListCalculations[] | null>()

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const { data, error } = await supabase.from('list-calculations').select('*')

      console.log(data, error)
      setList(data)
    }
    void getData()
  }, [])

  return (
    <>
      {list?.map((item) => (
        <div key={item.id}>
          <p>{item.id}</p>
          <p>{item.country}</p>
          <p>{item.arrival}</p>
          <p>{item.departure}</p>
          <p>{item.created_at}</p>
          <p>{item.updated_at}</p>
        </div>
      ))}
    </>
  )
}

export default ListCountingSection
