import { useCallback, useMemo, useRef, useState } from 'react'

import { countries } from '../../lib/countries'
import { countryCodeToFlagEmoji } from '../../lib/tripForm'
import styles from './CountryCombobox.module.css'

interface Option {
  code: string
  name: string
  flag: string
}

const ALL_OPTIONS: Option[] = countries.map(([code, name]) => ({
  code,
  name,
  flag: countryCodeToFlagEmoji(code)
}))

const normalize = (s: string) => s.trim().toLowerCase()

function filterOptions(query: string): Option[] {
  if (!query.trim()) return ALL_OPTIONS
  const q = normalize(query)
  const starts = ALL_OPTIONS.filter(o => normalize(o.name).startsWith(q) || normalize(o.code).startsWith(q))
  const partial = ALL_OPTIONS.filter(o => {
    if (starts.includes(o)) return false
    return normalize(o.name).includes(q) || normalize(o.code).includes(q)
  })
  return [...starts, ...partial]
}

interface Props {
  id: string
  name: string
  label?: string
  initialCode?: string
  placeholder?: string
  onSelect?: (code: string, name: string) => void
}

export function CountryCombobox({ id, name, label = 'Country', initialCode = '', placeholder = 'Search country', onSelect }: Props) {
  const listboxId = `${id}-listbox`

  const [query, setQuery] = useState<string>(() => {
    if (!initialCode) return ''
    return ALL_OPTIONS.find(o => o.code === initialCode)?.name ?? ''
  })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState(initialCode)
  const [activeIndex, setActiveIndex] = useState(0)

  const options = useMemo(() => filterOptions(query), [query])
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedOption = ALL_OPTIONS.find(o => o.code === selectedCode)
  const activeOptionId = isOpen && options[activeIndex] ? `${id}-opt-${options[activeIndex]!.code.toLowerCase()}` : ''

  const doSelect = useCallback((option: Option) => {
    setSelectedCode(option.code)
    setQuery(option.name)
    setIsOpen(false)
    onSelect?.(option.code, option.name)
  }, [onSelect])

  const doOpen = useCallback(() => {
    const idx = options.findIndex(o => o.code === selectedCode)
    setActiveIndex(idx >= 0 ? idx : 0)
    setIsOpen(true)
  }, [options, selectedCode])

  const doClose = useCallback(() => {
    setIsOpen(false)
    if (selectedCode) {
      const found = ALL_OPTIONS.find(o => o.code === selectedCode)
      if (found) setQuery(found.name)
    }
  }, [selectedCode])

  return (
    <div className="field">
      <label htmlFor={`${id}-input`}>{label}</label>
      <div className={`${styles.combo}${isOpen ? ` ${styles.open}` : ''}`}>
        <span className={styles.selected} aria-hidden="true">
          <span className={styles.selectedFlag}>{selectedOption?.flag ?? '🌍'}</span>
          <span className={styles.selectedCode}>{selectedCode || '--'}</span>
        </span>
        <input
          ref={inputRef}
          id={`${id}-input`}
          className={styles.input}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onFocus={() => { inputRef.current?.select(); doOpen() }}
          onClick={() => { inputRef.current?.select(); if (!isOpen) doOpen() }}
          onChange={e => { setQuery(e.target.value); setActiveIndex(0); setIsOpen(true) }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              if (!isOpen) { doOpen(); return }
              setActiveIndex(i => Math.min(i + 1, options.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              if (!isOpen) { doOpen(); return }
              setActiveIndex(i => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              if (!isOpen) return
              e.preventDefault()
              const opt = options[activeIndex]
              if (opt) doSelect(opt)
            } else if (e.key === 'Escape') {
              if (!isOpen) return
              e.preventDefault()
              doClose()
            }
          }}
          onBlur={() => { setTimeout(() => { if (document.activeElement !== inputRef.current) doClose() }, 0) }}
        />
        <button
          className={styles.toggle}
          type="button"
          aria-label="Toggle country list"
          tabIndex={-1}
          onClick={() => { if (isOpen) { doClose() } else { doOpen(); inputRef.current?.focus() } }}
        >
          ⌄
        </button>
        {isOpen && (
          <div id={listboxId} className={styles.list} role="listbox" aria-label={`${label} options`}>
            {options.length === 0 ? (
              <div className={styles.empty} aria-live="polite">No matching country.</div>
            ) : (
              options.map((option, i) => (
                <button
                  key={option.code}
                  id={`${id}-opt-${option.code.toLowerCase()}`}
                  className={[
                    styles.option,
                    i === activeIndex ? styles.optionActive : '',
                    option.code === selectedCode ? styles.optionSelected : ''
                  ].filter(Boolean).join(' ')}
                  type="button"
                  role="option"
                  aria-selected={option.code === selectedCode}
                  onMouseDown={e => { e.preventDefault(); doSelect(option); inputRef.current?.focus() }}
                >
                  <span className={styles.optionFlag}>{option.flag}</span>
                  <span className={styles.optionLabel}>{option.name}</span>
                  <span className={styles.optionCode}>{option.code}</span>
                  <span className={styles.optionCheck}>{option.code === selectedCode ? '✓' : ''}</span>
                </button>
              ))
            )}
          </div>
        )}
        <input type="hidden" id={id} name={name} value={selectedCode} />
      </div>
    </div>
  )
}
