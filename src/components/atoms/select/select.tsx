/* eslint-disable i18next/no-literal-string */
import { type FC } from 'react'

// TODO: basic react component for select element
export const Select: FC = () => (
  <div>
    <div>
      <label htmlFor="select-1" className="mb-2 block text-sm font-medium dark:text-white">Label</label>
      <div className="relative">
        <select
          id="select-1"
          className={`
            block w-full rounded-lg border-red-500 px-4 py-3 pe-16 text-sm focus:border-red-500 focus:ring-red-500
            disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
            dark:focus:ring-gray-600
          `}
        >
          <option selected>Open this select menu</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-8">
          {/* TODO: change to icon */}
          <svg
            className="size-4 shrink-0 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
      </div>
      <p className="mt-2 text-sm text-red-600">Please select a valid state.</p>
    </div>

    <div>
      <label htmlFor="select-2" className="mb-2 block text-sm font-medium dark:text-white">Label</label>
      <div className="relative">
        <select
          id="select-2"
          className={`
            block w-full rounded-lg border-teal-500 px-4 py-3 pe-16 text-sm focus:border-teal-500 focus:ring-teal-500
            disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
            dark:focus:ring-gray-600
          `}
        >
          <option>Open this select menu</option>
          <option selected>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-8">
          {/* TODO: Change Icon */}
          <svg
            className="size-4 shrink-0 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>
      <p className="mt-2 text-sm text-teal-600">Looks good!</p>
    </div>
  </div>
)
