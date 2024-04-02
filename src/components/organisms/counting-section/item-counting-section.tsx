/* eslint-disable i18next/no-literal-string */
import { type FC, memo } from 'react'

import { type ListCalculations } from '@libs/supabase/database.types'

interface Item extends Omit<ListCalculations, 'created_at' | 'updated_at'> {
  isResidency?: boolean
}

interface ItemCountingSectionProps {
  item: Item
}

const ItemCountingSection: FC<ItemCountingSectionProps> = ({ item }) => {
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
      {/* TODO: Future work */}
      {/* <td className="py-3 ps-4">
        <div className="flex h-5 items-center">
          <input
            id="hs-table-checkbox-1"
            type="checkbox"
            className="
              rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800
              dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
          />
          <label htmlFor="hs-table-checkbox-1" className="sr-only">Checkbox</label>
        </div>
      </td> */}
      {/* Country */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {item.country}
      </td>
      {/* Arrival */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatDate(item.arrival ?? '')}
      </td>
      {/* Departure */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatDate(item.departure ?? '')}
      </td>
      {/* Total Days */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {countTotalDays(item.arrival ?? '', item.departure ?? '') || 'All'}
      </td>
      {/* Calendar Days */}
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
        {countLastYearDays(item.arrival ?? '', item.departure ?? '') || 'All'}
      </td>
      {/* 183 Days? */}
      <td className="whitespace-nowrap px-6 py-4 text-end text-sm font-medium">
        <button
          type="button"
          className="
            inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600
            hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500
            dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          {isMoreThan183Days(item.arrival ?? '', item.departure ?? '')
            ? 'Si'
            : 'No'}
        </button>
      </td>
      {/* Residency */}
      <td className="whitespace-nowrap px-6 py-4 text-end text-sm font-medium">
        <button
          type="button"
          className="
            inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600
            hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500
            dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          {isMoreThan183Days(item.arrival ?? '', item.departure ?? '')
            ? 'Si'
            : 'No'}
        </button>
      </td>
    </tr>
  )
}

export default memo(ItemCountingSection)
