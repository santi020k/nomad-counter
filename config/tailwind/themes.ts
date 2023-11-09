import daisyuiTheme from 'daisyui/src/theming/themes'

export default [
  {
    light: {
      ...daisyuiTheme['[data-theme=light]'],
      primary: '#471AA0',
      secondary: '#B579E6',
      accent: '#f3e8fb',
      '.btn-primary': {
        'background-color': '#471AA0',
        'border-color': '#471AA0',
        color: '#fff'
      },
      '.btn-secondary': {
        'background-color': '#B579E6',
        'border-color': '#B579E6',
        color: '#fff'
      }
    },
    dark: {
      ...daisyuiTheme['[data-theme=dark]'],
      primary: '#5C469C',
      secondary: '#D4ADFC',
      accent: '#f3e8fb',
      textColor: '#fff',

      '.btn-primary': {
        'background-color': '#5C469C',
        'border-color': '#5C469C',
        color: '#fff'
      },
      '.btn-secondary': {
        'background-color': '#D4ADFC',
        'border-color': '#D4ADFC',
        color: '#fff'
      },
      'base-content': '#dadada'
    }
  }
]
