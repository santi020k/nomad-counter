module.exports = [
  'error',
  {
    groups: [
      // Packages `react` related packages come first.
      ['^react'],
      // Libs Packages
      ['^@?\\w', '^(@|components)(/.*|$)'],
      // I18n
      ['^(@i18n)'],
      // Themes
      ['^(@themes)'],
      // Internal packages.
      ['^(@atoms)(/.*|$)'],
      ['^(@molecules)(/.*|$)'],
      ['^(@organisms)(/.*|$)'],
      ['^(@layouts)(/.*|$)'],
      ['^(@libs)(/.*|$)'],
      ['^(@store)(/.*|$)'],
      ['^(@hooks)(/.*|$)'],
      ['^(@models)(/.*|$)'],
      ['^(@utils)(/.*|$)'],
      ['^(@mocks)(/.*|$)'],
      // Side effect imports.
      ['^\\u0000'],
      // Parent imports. Put `..` last.
      ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
      // Other relative imports. Put same-folder imports and `.` last.
      ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
      // Style imports.
      ['^.+\\.?(css)$']
    ]
  }
]