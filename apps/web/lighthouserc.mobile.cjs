module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4321/'],
      startServerCommand: 'pnpm run dev --host 127.0.0.1',
      startServerReadyPattern: 'Local',
      settings: {
        preset: 'desktop',
        emulatedFormFactor: 'mobile'
      },
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
}
