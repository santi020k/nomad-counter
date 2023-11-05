module.exports = [
  'error',
  {
    groups: [
      // Packages `react` related packages come first.
      ['^react'],
      // Libs Packages
      ['^@?\\w', '^(@|components)(/.*|$)'],
      // Internal packages.
      ['^(@atoms)(/.*|$)'],
      ['^(@molecules)(/.*|$)'],
      ['^(@organisms)(/.*|$)'],
      ['^(@layouts)(/.*|$)'],
      ['^(@pages)(/.*|$)'],
      ['^(@libs)(/.*|$)'],
      ['^(@store)(/.*|$)'],
      ['^(@models)(/.*|$)'],
      ['^(@utils)(/.*|$)'],
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