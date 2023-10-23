import { type FC, type ReactElement, useState } from 'react'
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

  return (
    <button type="button" onClick={toggleTheme} className={`btn btn-circle h-12 w-12 ${isLightTheme ? 'btn-primary' : 'btn-secondary'}`}>
      {isLightTheme ? lightIcon : darkIcon }
    </ button>
  )
}

export default ToggleThemeButton
