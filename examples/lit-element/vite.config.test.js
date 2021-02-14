import { defineConfig } from 'vite'
import viteTestPlugin from 'vite-plugin-test'

export default defineConfig({
  plugins: [
    viteTestPlugin()
  ]
})
