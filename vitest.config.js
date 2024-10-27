import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource:['./src'],
    exclude:['node_modules'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['scripts','dist', './vitest.config.js']
    },
  },
})