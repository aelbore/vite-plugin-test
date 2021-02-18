import { Plugin } from 'vite'

import { configureServer } from './configureServer'
import { transform } from './transform'

import { TestPluginOptions } from './options'

export default function viteTestPlugin(options?: TestPluginOptions) {
  const plugin: Plugin = {
    name: 'vite-plugin-test',
    apply: 'serve',
    configureServer: configureServer(options),
    transform: transform(options)
  }
  return plugin
}