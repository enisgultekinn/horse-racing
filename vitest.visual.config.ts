import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom'],
    },
    optimizeDeps: {
      include: ['vue', '@vue/test-utils'],
    },
    test: {
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['src/**/__tests__/**/*.visual.test.ts'],
      setupFiles: ['./src/__tests__/visual.setup.ts'],
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        screenshotFailures: false,
        viewport: { width: 1280, height: 1400 },
        instances: [{ browser: 'chromium' }],
      },
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            allowedMismatchedPixelRatio: 0.01,
          },
        },
      },
    },
  }),
)
