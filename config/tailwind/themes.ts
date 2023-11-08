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
      primary: '#b296d6',
      secondary: '#e2c8f6',
      accent: '#f3e8fb',
      '.btn-primary': {
        'background-color': '#b296d6',
        'border-color': '#b296d6',
        color: '#fff'
      },
      '.btn-secondary': {
        'background-color': '#e2c8f6',
        'border-color': '#e2c8f6',
        color: '#fff'
      }
    }
  }
]