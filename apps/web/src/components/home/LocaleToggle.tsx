import { useState } from 'react'

import { readLocale, saveLocale, type Locale } from '../../lib/app/i18n'
import styles from './LocaleToggle.module.css'

export function LocaleToggle() {
  const [locale, setLocale] = useState<Locale>(() => readLocale())

  const toggle = (next: Locale) => {
    if (next === locale) return
    saveLocale(next)
    setLocale(next)
  }

  return (
    <div className={styles.toggle} role="group" aria-label="Language">
      <button
        type="button"
        className={styles.option}
        aria-pressed={locale === 'en'}
        onClick={() => { toggle('en') }}
      >
        EN
      </button>
      <button
        type="button"
        className={styles.option}
        aria-pressed={locale === 'es'}
        onClick={() => { toggle('es') }}
      >
        ES
      </button>
    </div>
  )
}
