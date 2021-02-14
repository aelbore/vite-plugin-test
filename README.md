# vite-plugin-test
Vite plugin with mocha and puppeteer

Installation
------------
  ```
    npm install --save-dev vite-plugin-test puppeteer
  ```

Example Code
------------
* `npm install`
* `npm run build`
* `cd examples/vue`
* `npm test`

Plugin usage
------------
* Create `vite.config.test.js` file
```typescript
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import viteTestPlugin from 'vite-plugin-test'

export default defineConfig({
  plugins: [
    vue(),
    viteTestPlugin({ 
      watch: true 
    })
  ]
})
```
* `vite --config vite.config.test.js`