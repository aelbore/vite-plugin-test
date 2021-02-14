import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

import viteTestPlugin from 'vite-plugin-test'

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteTestPlugin({ 
      loaders: {
        '.spec.js': 'jsx'
      } 
    })
  ]
})
