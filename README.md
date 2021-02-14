# vite-plugin-test
Vite plugin with mocha and puppeteer \
Headless test your `Vue`, `React` and `Lit-Element` component

Installation
------------
  ```
    npm install --save-dev vite-plugin-test puppeteer
  ```

Getting Started
------------
* `yarn install`
* `yarn build`

Example Code
------------
* Vue
  ```
  yarn --cwd examples/vue test
  ```
* Lit-Element
  ```
  yarn --cwd examples/lit-element test
  ```
* React
  ```
  yarn --cwd examples/react test
  ```

Options
------------
```typescript
export interface TestPluginOptions {
  dir?: string
  watch?: boolean
  loaders?: {
    [ext: string]: Loader
  }
}
```

* `dir`     - [default: 'tests'] directory where the test or spec files
* `watch`   - [default: false] enable/diable watch
* `loaders` - when you have a `.js` test files with `jsx` or `tsx` code \
  (Please see `./examples/react/vite.config.test.ts`)
  ```
  loaders: {
    '.spec.js': 'jsx'
  }
  ```

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

TODO
------------
* Code Coverage
* Typescript spec files