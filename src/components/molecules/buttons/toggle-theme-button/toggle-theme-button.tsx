import { type FC, useEffect, useState } from 'react'

import { IconMoon, IconSunHigh } from '@tabler/icons-react'
import { match } from 'ts-pattern'

import { defaultTheme, type Theme, themes } from '@models/theme-model'

const ToggleThemeButton: FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)

  const isLightTheme = currentTheme === themes.enum.light

  const toggleTheme = (): void => {
    setCurrentTheme((prevTheme) => {
      const theme = prevTheme === themes.enum.dark ? themes.enum.light : themes.enum.dark
      document?.documentElement?.setAttribute('data-theme', theme)
      match(theme)
        .with(themes.enum.dark, () => { document.documentElement.classList.add('dark') })
        .with(themes.enum.light, () => { document.documentElement.classList.remove('dark') })
      return theme
    })
  }

  useEffect(() => {
    // NOTE: Normally in react it is not advisable to use window or document,
    // but with astro and static pages it is necessary to use them.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const newTheme = event.matches ? themes.enum.dark : themes.enum.light
      setCurrentTheme(newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
      match(newTheme)
        .with(themes.enum.dark, () => { document.documentElement.classList.add('dark') })
        .with(themes.enum.light, () => { document.documentElement.classList.remove('dark') })
    })

    // First time load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme(themes.enum.dark)
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <label
      htmlFor="toggle-theme-button"
      className={`btn btn-circle swap swap-rotate h-12 w-12 ${isLightTheme ? 'btn-primary' : 'btn-secondary'}`}
      aria-label="Light dark theme toggle"
    >
      <input
        onChange={toggleTheme}
        type="checkbox"
        checked={isLightTheme}
        id="toggle-theme-button"
        className="hidden"
      />

      <IconSunHigh className="swap-on fill-current" />
      <IconMoon className="swap-off fill-current" />
    </ label>
  )
}

export default ToggleThemeButton
