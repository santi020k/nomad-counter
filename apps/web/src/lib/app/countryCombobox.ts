import { $$ } from './dom'

import { countries } from '../countries'
import { countryCodeToFlagEmoji, escapeHtml } from '../tripForm'

interface CountryComboOption {
  code: string
  flag: string
  name: string
}

interface CountryComboState {
  input: HTMLInputElement
  isOpen: boolean
  list: HTMLElement
  options: CountryComboOption[]
  root: HTMLElement
  selectedCode: string
  selectedCodeText: HTMLElement
  selectedFlag: HTMLElement
  select: HTMLSelectElement
  visibleOptions: CountryComboOption[]
}

const countryCombos = new Map<string, CountryComboState>()

export const countryOptions = () => countries.map(([code, name]) => `<option value="${code}" data-name="${name}">${name}</option>`).join('')

export const countryNameFor = (select: HTMLSelectElement) => select.selectedOptions[0]?.dataset.name ?? select.value

const countryComboOptions = (): CountryComboOption[] => countries.map(([code, name]) => ({
  code,
  flag: countryCodeToFlagEmoji(code),
  name
}))

const normalizeCountryQuery = (value: string) => value.trim().toLowerCase()
const optionIdFor = (selectId: string, code: string) => `${selectId}-opt-${code.toLowerCase()}`

const setComboExpanded = (combo: CountryComboState, expanded: boolean) => {
  combo.input.setAttribute('aria-expanded', String(expanded))
}

const moveComboActiveTo = (combo: CountryComboState, index: number) => {
  const optionEls = [...combo.list.querySelectorAll<HTMLElement>('[role="option"]')]

  if (optionEls.length === 0) {
    combo.input.setAttribute('aria-activedescendant', '')

    return
  }

  const safeIndex = Math.max(0, Math.min(index, optionEls.length - 1))

  optionEls.forEach((el, i) => {
    const active = i === safeIndex

    if (active) {
      el.dataset.active = 'true'

      combo.input.setAttribute('aria-activedescendant', el.id)

      el.scrollIntoView({ block: 'nearest' })
    } else {
      delete el.dataset.active
    }
  })
}

const renderCountryComboOptions = (combo: CountryComboState, query = '') => {
  const normalized = normalizeCountryQuery(query)
  const startsWithMatches = combo.options.filter(option => normalizeCountryQuery(option.name).startsWith(normalized) || normalizeCountryQuery(option.code).startsWith(normalized))

  const partialMatches = combo.options.filter(option => {
    const matchesName = normalizeCountryQuery(option.name).includes(normalized)
    const matchesCode = normalizeCountryQuery(option.code).includes(normalized)
    const alreadyMatched = normalizeCountryQuery(option.name).startsWith(normalized) || normalizeCountryQuery(option.code).startsWith(normalized)

    return !alreadyMatched && (matchesName || matchesCode)
  })

  combo.visibleOptions = normalized ? [...startsWithMatches, ...partialMatches] : combo.options

  if (combo.visibleOptions.length === 0) {
    combo.list.innerHTML = '<div class="combo-empty" aria-live="polite">No matching country.</div>'

    combo.input.setAttribute('aria-activedescendant', '')

    return
  }

  combo.list.innerHTML = combo.visibleOptions.map(option => {
    const selected = option.code === combo.selectedCode

    return `<button
      id="${optionIdFor(combo.select.id, option.code)}"
      class="combo-option"
      type="button"
      role="option"
      aria-selected="${String(selected)}"
      data-country-code="${escapeHtml(option.code)}"
    >
      <span class="combo-option-flag" aria-hidden="true">${option.flag}</span>
      <span class="combo-option-label">${escapeHtml(option.name)}</span>
      <span class="combo-option-code">${escapeHtml(option.code)}</span>
      <span class="combo-option-check" aria-hidden="true">${selected ? '✓' : ''}</span>
    </button>`
  }).join('')

  const selectedIndex = combo.visibleOptions.findIndex(option => option.code === combo.selectedCode)

  moveComboActiveTo(combo, selectedIndex >= 0 ? selectedIndex : 0)
}

const updateCountryComboBadge = (combo: CountryComboState, option: CountryComboOption | undefined) => {
  if (!option) {
    combo.selectedFlag.textContent = '🌍'

    combo.selectedCodeText.textContent = '--'

    return
  }

  combo.selectedFlag.textContent = option.flag

  combo.selectedCodeText.textContent = option.code
}

const openCountryCombo = (combo: CountryComboState) => {
  combo.isOpen = true

  combo.root.dataset.open = 'true'

  setComboExpanded(combo, true)
}

const closeCountryCombo = (combo: CountryComboState) => {
  combo.isOpen = false

  delete combo.root.dataset.open

  setComboExpanded(combo, false)
}

export const syncCountryComboFromSelect = (selectId: string) => {
  const combo = countryCombos.get(selectId)

  if (!combo) {
    return
  }

  combo.selectedCode = combo.select.value ? combo.select.value : combo.options[0]?.code ?? ''

  const active = combo.options.find(option => option.code === combo.selectedCode)

  if (active) {
    combo.input.value = active.name
  }

  updateCountryComboBadge(combo, active)

  renderCountryComboOptions(combo, '')
}

const selectCountryFromCombo = (combo: CountryComboState, code: string) => {
  combo.selectedCode = code

  combo.select.value = code

  const active = combo.options.find(option => option.code === code)

  if (active) {
    combo.input.value = active.name
  }

  updateCountryComboBadge(combo, active)

  renderCountryComboOptions(combo, '')

  combo.select.dispatchEvent(new Event('change', { bubbles: true }))
}

const closeAllCountryCombos = () => {
  countryCombos.forEach(closeCountryCombo)
}

export const initCountryComboboxes = () => {
  countryCombos.clear()

  $$('[data-combo-root]').forEach(root => {
    const selectId = root.dataset.comboFor
    const select = selectId ? document.getElementById(selectId) as HTMLSelectElement | null : null
    const input = root.querySelector<HTMLInputElement>('.combo-input')
    const list = root.querySelector<HTMLElement>('.combo-list')
    const selectedFlag = root.querySelector<HTMLElement>('.combo-selected-flag')
    const selectedCodeText = root.querySelector<HTMLElement>('.combo-selected-code')
    const toggle = root.querySelector<HTMLButtonElement>('.combo-toggle')

    if (!selectId || !select || !input || !list || !selectedFlag || !selectedCodeText) {
      return
    }

    const combo: CountryComboState = {
      input,
      isOpen: false,
      list,
      options: countryComboOptions(),
      root,
      selectedCode: select.value,
      selectedCodeText,
      selectedFlag,
      select,
      visibleOptions: []
    }

    countryCombos.set(selectId, combo)

    syncCountryComboFromSelect(selectId)

    input.addEventListener('focus', () => {
      closeAllCountryCombos()

      openCountryCombo(combo)

      input.select()

      renderCountryComboOptions(combo, '')
    })

    input.addEventListener('click', () => {
      input.select()

      if (!combo.isOpen) {
        closeAllCountryCombos()

        openCountryCombo(combo)
      }

      renderCountryComboOptions(combo, '')
    })

    input.addEventListener('input', () => {
      if (!combo.isOpen) {
        closeAllCountryCombos()

        openCountryCombo(combo)
      }

      renderCountryComboOptions(combo, input.value)
    })

    input.addEventListener('keydown', event => {
      const optionEls = [...combo.list.querySelectorAll<HTMLElement>('[role="option"]')]
      const activeId = input.getAttribute('aria-activedescendant') ?? ''
      const activeIndex = optionEls.findIndex(el => el.id === activeId)

      if (event.key === 'ArrowDown') {
        event.preventDefault()

        if (!combo.isOpen) {
          closeAllCountryCombos()

          openCountryCombo(combo)

          renderCountryComboOptions(combo, '')

          return
        }

        moveComboActiveTo(combo, activeIndex + 1)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        if (!combo.isOpen) {
          closeAllCountryCombos()

          openCountryCombo(combo)

          renderCountryComboOptions(combo, '')

          return
        }

        moveComboActiveTo(combo, activeIndex <= 0 ? 0 : activeIndex - 1)
      }

      if (event.key === 'Enter') {
        if (!combo.isOpen) {
          return
        }

        event.preventDefault()

        const activeEl = optionEls.find(el => el.dataset.active === 'true') ?? optionEls[0]
        const selectedCode = activeEl?.dataset.countryCode

        if (selectedCode) {
          selectCountryFromCombo(combo, selectedCode)
        }

        closeCountryCombo(combo)
      }

      if (event.key === 'Escape') {
        if (!combo.isOpen) {
          return
        }

        event.preventDefault()

        syncCountryComboFromSelect(selectId)

        closeCountryCombo(combo)
      }
    })

    list.addEventListener('mousedown', event => {
      event.preventDefault()

      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-country-code]')
      const selectedCode = target?.dataset.countryCode

      if (!selectedCode) {
        return
      }

      selectCountryFromCombo(combo, selectedCode)

      closeCountryCombo(combo)

      input.focus()
    })

    toggle?.addEventListener('click', () => {
      if (combo.isOpen) {
        closeCountryCombo(combo)

        return
      }

      closeAllCountryCombos()

      openCountryCombo(combo)

      renderCountryComboOptions(combo, '')

      input.focus()
    })

    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (document.activeElement === input) {
          return
        }

        syncCountryComboFromSelect(selectId)

        closeCountryCombo(combo)
      }, 0)
    })

    select.addEventListener('change', () => {
      syncCountryComboFromSelect(selectId)
    })
  })

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement

    if (!target.closest('[data-combo-root]')) {
      closeAllCountryCombos()
    }
  })
}
