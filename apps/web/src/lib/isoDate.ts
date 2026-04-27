import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const todayIsoDate = (): string => format(new Date(), 'yyyy-MM-dd')

export const isValidIsoDate = (value: string): boolean => {
  const trimmed = value.trim()

  if (!ISO_DATE.test(trimmed)) {
    return false
  }

  const date = parseISO(trimmed)

  return isValid(date) && format(date, 'yyyy-MM-dd') === trimmed
}

export const inclusiveCalendarDays = (startDate: string, endDate: string): number =>
  differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1

export const formatIsoDisplayDate = (date: string): string => format(parseISO(date), 'MMM d, yyyy')
