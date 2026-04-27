import { $ } from './dom'

const getTripFormEls = () => ({
  open: $<HTMLInputElement>('#trip-open-ended'),
  exit: $<HTMLInputElement>('#trip-exit'),
  entry: $<HTMLInputElement>('#trip-entry')
})

export const syncExitMinFromEntry = () => {
  const { entry, exit } = getTripFormEls()

  if (!entry || !exit) {
    return
  }

  const v = entry.value

  if (v) {
    exit.min = v
  } else {
    exit.removeAttribute('min')
  }
}

export const applyOpenEndedUi = (checked: boolean) => {
  const { exit } = getTripFormEls()

  if (!exit) {
    return
  }

  if (checked) {
    if (exit.value) {
      exit.dataset.lastExit = exit.value
    }

    exit.value = ''

    exit.disabled = true

    exit.removeAttribute('required')
  } else {
    exit.disabled = false

    exit.setAttribute('required', '')

    const last = exit.dataset.lastExit

    if (last) {
      exit.value = last

      delete exit.dataset.lastExit
    }
  }

  syncExitMinFromEntry()
}

export const wireTripFormDates = () => {
  const { open, entry, exit } = getTripFormEls()

  open?.addEventListener('change', () => {
    applyOpenEndedUi(open.checked)
  })

  entry?.addEventListener('change', () => {
    syncExitMinFromEntry()

    if (exit && !exit.disabled && entry.value && exit.value && exit.value < entry.value) {
      exit.value = entry.value
    }
  })

  if (open?.checked) {
    applyOpenEndedUi(true)
  } else {
    syncExitMinFromEntry()
  }
}

export const initDateShellPickers = () => {
  document.querySelectorAll<HTMLElement>('[data-date-shell]').forEach(shell => {
    if (shell.dataset.datePickerBound === 'true') {
      return
    }

    shell.dataset.datePickerBound = 'true'

    const input = shell.querySelector<HTMLInputElement>('input[type="date"]')
    const openBtn = shell.querySelector<HTMLButtonElement>('[data-date-open]')

    if (!input || !openBtn) {
      return
    }

    openBtn.addEventListener('click', event => {
      event.preventDefault()

      if (input.disabled) {
        return
      }

      try {
        if (typeof input.showPicker === 'function') {
          input.showPicker()
        } else {
          input.focus()

          input.click()
        }
      } catch {
        input.focus()
      }
    })
  })
}
