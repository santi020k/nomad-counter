// TODO: Deprecated Code

export const enum themes {
  LIGHT = 'light',
  DARK = 'dark'
}

export const enum lightColors {
  PRIMARY = '#471AA0',
  SECONDARY = '#B579E6',
  PRIMARY_CONTENT = '#C7BAE2',
  SECONDARY_CONTENT = '#e8d6f7',
  ACCENT = '#1ECDBC',
  WHITE = '#fff'
}

export const enum darkColors {
  PRIMARY = '#5C469C',
  SECONDARY = '#D4ADFC',
  PRIMARY_CONTENT = '#cec7e1',
  SECONDARY_CONTENT = '#f2e6fe',
  ACCENT = '#1ECDBC',
  WHITE = '#fff',
  BASE = '#dadada'
}

export default [
  {
    light: {
      primary: lightColors.PRIMARY,
      secondary: lightColors.SECONDARY,
      accent: lightColors.ACCENT,
      '.btn-primary': {
        'background-color': lightColors.PRIMARY,
        'border-color': lightColors.PRIMARY,
        color: lightColors.WHITE
      },
      '.btn-secondary': {
        'background-color': lightColors.SECONDARY,
        'border-color': lightColors.SECONDARY,
        color: lightColors.WHITE
      }
    },
    dark: {
      primary: darkColors.PRIMARY,
      secondary: darkColors.SECONDARY,
      accent: darkColors.ACCENT,
      '.btn-primary': {
        'background-color': darkColors.PRIMARY,
        'border-color': darkColors.PRIMARY,
        color: darkColors.WHITE
      },
      '.btn-secondary': {
        'background-color': darkColors.SECONDARY,
        'border-color': darkColors.SECONDARY,
        color: darkColors.WHITE
      },
      'base-content': darkColors.BASE
    }
  }
]
