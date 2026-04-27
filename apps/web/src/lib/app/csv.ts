import { validateTripForm } from '../tripForm'
import { saveLocalState } from './localStore'
import { setTripFormStatus } from './formStatus'
import type { State } from './types'

export const exportCsv = (state: State) => {
  const rows = [
    ['countryCode', 'countryName', 'entryDate', 'exitDate', 'note'],
    ...state.trips.map(trip => [trip.countryCode, trip.countryName, trip.entryDate, trip.exitDate ?? '', trip.note ?? ''])
  ]

  const csv = rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')

  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = 'nomad-counter-trips.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

export const importCsv = async (
  state: State,
  file: File,
  options: { renderAll: () => void, syncLocalToAccount: () => Promise<void> }
) => {
  const text = await file.text()
  const [, ...lines] = text.trim().split(/\r?\n/)
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

    state.trips.push({
      id: `local_${crypto.randomUUID()}`,
      countryCode,
      countryName,
      entryDate: entryTrim,
      exitDate: rowValidation.exitDate,
      note: note || null
    })

    imported++
  }

  saveLocalState(state.trips, state.countries)

  if (state.authenticated) {
    await options.syncLocalToAccount()
  } else {
    options.renderAll()
  }

  if (imported === 0 && skipped > 0) {
    setTripFormStatus('No valid trips imported. Check dates (exit on or after entry) and required columns.', 'error')
  } else if (skipped > 0) {
    setTripFormStatus(`Imported ${String(imported)} trip(s). Skipped ${String(skipped)} invalid row(s).`, 'ok')
  } else if (imported > 0) {
    setTripFormStatus(`Imported ${String(imported)} trip(s).`, 'ok')
  }
}
