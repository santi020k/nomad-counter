/* eslint-disable i18next/no-literal-string */
import { type FC, memo } from 'react'

const ListCountingSection: FC = () => (
  <tr>
    {/* TODO: Future work */}
    {/* <th scope="col" className="py-3 ps-4">
      <div className="flex h-5 items-center">
        <input
          id="hs-table-checkbox-all"
          type="checkbox"
          className="rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800
              dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="hs-table-checkbox-all" className="sr-only">Checkbox</label>
      </div>
    </th> */}
    <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Country</th>
    <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Arrival</th>
    <th scope="col" className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Departure</th>
    <th scope="col" className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Total Days</th>
    <th scope="col" className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Calendar Days</th>
    <th scope="col" className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">183 Days?</th>
    <th scope="col" className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Residency</th>
  </tr>
)

export default memo(ListCountingSection)
