/* eslint-disable i18next/no-literal-string */
import { type FC } from 'react'

import { type ListCalculations } from '@libs/supabase/database.types'

interface Item extends Omit<ListCalculations, 'created_at' | 'updated_at'> {
  isResidency?: boolean
}
interface ItemCountingSectionProps {
  item: Item
  index: number
}

const ItemCountingSection: FC<ItemCountingSectionProps> = ({ item, index }) => (
  <tr>
    {/* # */}
    <th>{index}</th>
    {/* Country */}
    <td>{item.country}</td>
    {/* Arrival */}
    <td>{item.arrival}</td>
    {/* Departure */}
    <td>{item.departure}</td>
    {/* Total Days */}
    <td>All</td>
    {/* Last Year Days */}
    <td>181</td>
    {/* 183 Days? */}
    <td>No</td>
    {/* Residency */}
    <th>
      <label>
        <input type="checkbox" className="checkbox" disabled checked={item.isResidency} />
      </label>
    </th>
  </tr>
)

export default ItemCountingSection
