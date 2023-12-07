import react from '@vitejs/plugin-react'
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src/**'],
      exclude: ['config/**', 'src/env.d.ts', 'src/models/**', 'src/mocks/**']
    }
  }
})
