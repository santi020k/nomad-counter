import { type FC, useEffect, useState } from 'react'

import { IconMoon, IconSunHigh } from '@tabler/icons-react'
import { match } from 'ts-pattern'

import useSessionStorage from '@hooks/use-session-storage'

import { defaultTheme, type Theme, themes } from '@models/theme-model'

const ToggleThemeButton: FC = () => {
  const [currentTheme, setCurrentTheme] = useSessionStorage<Theme>('theme', defaultTheme)
  const [isLightTheme, setIsLightTheme] = useState<boolean>(currentTheme === themes.enum.light)

  console.log('🚀 ~ file: toggle-theme-button.tsx:13 ~ isLightTheme:', isLightTheme, currentTheme)

  const handleTheme = (theme: Theme): void => {
    setCurrentTheme(theme)
    setIsLightTheme(theme === themes.enum.light)
    document.documentElement.setAttribute('data-theme', theme)
    match(theme)
      .with(themes.enum.dark, () => { document.documentElement.classList.add('dark') })
      .with(themes.enum.light, () => { document.documentElement.classList.remove('dark') })
  }

  const toggleTheme = (): void => {
    handleTheme(currentTheme === themes.enum.dark ? themes.enum.light : themes.enum.dark)
  }

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setCurrentTheme(event.matches ? themes.enum.dark : themes.enum.light)
      setIsLightTheme(!event.matches)
    })

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme(themes.enum.dark)
      setIsLightTheme(false)
    }
  }, [])

  return (
    <label
      htmlFor="toggle-theme-button"
      className={`btn btn-circle swap swap-rotate h-12 w-12 ${isLightTheme ? 'btn-primary' : 'btn-secondary'}`}
      aria-label="light dark theme toggle"
    >
      <input
        onChange={toggleTheme}
        type="checkbox"
        checked={isLightTheme}
        id="toggle-theme-button"
        className="hidden"
      />

      <IconSunHigh size={18} className="swap-on fill-current" />
      <IconMoon size={18} className="swap-off fill-current" />
    </ label>
  )
}

export default ToggleThemeButton
