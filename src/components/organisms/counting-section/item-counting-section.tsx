import { type FC } from 'react'

import { type ListCalculations } from '@libs/supabase/database.types'

interface ItemCountingSectionProps {
  item: ListCalculations
}

const ItemCountingSection: FC<ItemCountingSectionProps> = ({ item }) => (
  <div>
    <p>{item.id}</p>
    <p>{item.country}</p>
    <p>{item.arrival}</p>
    <p>{item.departure}</p>
    <p>{item.created_at}</p>
    <p>{item.updated_at}</p>
  </div>
)

export default ItemCountingSection
