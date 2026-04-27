import { validateTripForm } from '../tripForm'
import { summarizeLocal } from './dateMath'
import { saveLocalState } from './localStore'
import { getSnapshot, setState } from '../store'
import type { Trip } from './types'

export const exportCsv = (): void => {
  const { trips } = getSnapshot()
  const rows = [
    ['countryCode', 'countryName', 'entryDate', 'exitDate', 'note'],
    ...trips.map(trip => [trip.countryCode, trip.countryName, trip.entryDate, trip.exitDate ?? '', trip.note ?? ''])
  ]

  const csv = rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')

  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = 'nomad-counter-trips.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

export const importCsv = async (
  file: File,
  options: { syncLocalToAccount: () => Promise<void> }
): Promise<string> => {
  const { trips: existingTrips, countries, authenticated, windowMode } = getSnapshot()
  const text = await file.text()
  const [, ...lines] = text.trim().split(/\r?\n/)
  const newTrips: Trip[] = [...existingTrips]
  let imported = 0
  let skipped = 0

  for (const line of lines) {
    const [countryCode = '', countryName = '', entryDate = '', exitDate = '', note = ''] = line
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(value => value.replace(/^"|"$/g, '').replaceAll('""', '"'))

    if (!countryCode || !countryName || !entryDate.trim()) {
      skipped++
      continue
    }

    const entryTrim = entryDate.trim()
    const exitTrim = exitDate.trim()
    const rowValidation = validateTripForm({
      entryDate: entryTrim,
      exitDate: exitTrim,
      openEnded: exitTrim.length === 0
    })

    if (!rowValidation.ok) {
      skipped++
      continue
    }

    newTrips.push({
      id: `local_${crypto.randomUUID()}`,
      countryCode,
      countryName,
      entryDate: entryTrim,
      exitDate: rowValidation.exitDate,
      note: note || null
    })

    imported++
  }

  setState(prev => ({ ...prev, trips: newTrips }))
  saveLocalState(newTrips, countries)

  if (authenticated) {
    await options.syncLocalToAccount()
  } else {
    const local = summarizeLocal(newTrips, countries, windowMode)
    setState(prev => ({ ...prev, summary: local.summary, windowLabel: local.windowLabel }))
  }

  if (imported === 0 && skipped > 0) {
    return 'error:No valid trips imported. Check dates (exit on or after entry) and required columns.'
  }

  if (skipped > 0) {
    return `ok:Imported ${String(imported)} trip(s). Skipped ${String(skipped)} invalid row(s).`
  }

  return `ok:Imported ${String(imported)} trip(s).`
}
