import { transformSync, Loader } from 'esbuild'

export interface TestPluginOptions {
  dir?: string
  watch?: boolean
  loaders?: {
    [ext: string]: Loader
  }
}