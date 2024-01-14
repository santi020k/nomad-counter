/* eslint-disable i18next/no-literal-string */
import { type FC, memo } from 'react'

import { type ListCalculations } from '@libs/supabase/database.types'

interface Item extends Omit<ListCalculations, 'created_at' | 'updated_at'> {
  isResidency?: boolean
}
interface ItemCountingSectionProps {
  item: Item
  index: number
}

const ItemCountingSection: FC<ItemCountingSectionProps> = ({ item, index }) => {
  const isValidDate = (date: string): boolean => {
    const newDate = new Date(date)
    return !Number.isNaN(newDate.getTime())
  }

  const isValidDates = (arrival: string, departure: string): boolean => {
    if (!isValidDate(arrival) || !isValidDate(departure)) return false
    return true
  }

  const countTotalDays = (arrival: string, departure: string): number => {
    if (!isValidDates(arrival, departure)) return 0
    const arrivalDate = new Date(arrival)
    const departureDate = new Date(departure)
    const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const countLastYearDays = (arrival: string, departure: string): number => {
  // TODO: This is not working properly, fix it!
    if (!isValidDates(arrival, departure)) return 0
    const arrivalDate = new Date(arrival)
    const departureDate = new Date(departure)
    const diffTime = Math.abs(departureDate.getTime() - arrivalDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isMoreThan183Days = (arrival: string, departure: string): boolean => {
    const totalDays = countTotalDays(arrival, departure)
    if (!totalDays) return false
    return totalDays > 183
  }

  const formatDate = (date: string): string => {
    if (!isValidDate(date)) return '-------'
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  return (
    <tr>
      {/* # */}
      <th>{index}</th>
      {/* Country */}
      <td>{item.country}</td>
      {/* Arrival */}
      <td>{formatDate(item.arrival ?? '')}</td>
      {/* Departure */}
      <td>{formatDate(item.departure ?? '')}</td>
      {/* Total Days */}
      <td>{countTotalDays(item.arrival ?? '', item.departure ?? '') || 'All'}</td>
      {/* Last Year Days */}
      <td>{countLastYearDays(item.arrival ?? '', item.departure ?? '') || 'All'}</td>
      {/* 183 Days? */}
      <td>{isMoreThan183Days(item.arrival ?? '', item.departure ?? '') ? 'Si' : 'No'}</td>
      {/* Residency */}
      <th>
        <label>
          <input type="checkbox" className="checkbox" disabled checked={item.isResidency} />
        </label>
      </th>
    </tr>
  )
}

export default memo(ItemCountingSection)
