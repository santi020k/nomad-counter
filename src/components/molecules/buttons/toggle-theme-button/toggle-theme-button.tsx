import { type FC, type ReactElement, useState, useEffect } from 'react'
import { themes, defaultTheme, type Theme } from '@models/theme-model'

interface ToggleThemeButtonProps {
  lightIcon?: ReactElement
  darkIcon?: ReactElement
}

const ToggleThemeButton: FC<ToggleThemeButtonProps> = ({ lightIcon, darkIcon }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)

  const isLightTheme = currentTheme === themes.enum.light

  const toggleTheme = (): void => {
    setCurrentTheme((prevTheme) => {
      const theme = prevTheme === themes.enum.dark ? themes.enum.light : themes.enum.dark
      document?.documentElement?.setAttribute('data-theme', theme)
      return theme
    })
  }

  useEffect(() => {
    // NOTE: Normally in react it is not advisable to use window or document,
    // but with astro and static pages it is necessary
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme(themes.enum.dark)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-circle h-12 w-12 ${isLightTheme ? 'btn-primary' : 'btn-secondary'}`}
      aria-label="light dark theme toggle"
    >
      {isLightTheme ? lightIcon : darkIcon }
    </ button>
  )
}

export default ToggleThemeButton
