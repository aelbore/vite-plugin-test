import { TestPluginOptions } from './options'

import { transformSync, Loader } from 'esbuild'
import path from 'path'

const getExt = (str: string) => {
  const basename = path.basename(str);
  const firstDot = basename.indexOf('.');
  const lastDot = basename.lastIndexOf('.');
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');

  if (firstDot === lastDot) return extname

  return basename.slice(firstDot, lastDot) + extname
}

export function transform(options: TestPluginOptions) {
  const { loaders } = options || {}

  return (code: string, id: string) => {
    const ext = getExt(id)
    if (loaders && Object.keys(loaders).includes(ext)) {
      const loader = options?.loaders && options?.loaders[ext] 
        ? options.loaders[ext]  
        : path.extname(id).slice(1) as Loader

      const result = transformSync(code, {
        loader,
        format: 'esm',
        sourcemap: false,
        target: 'es2017'
      })

      return {
        code: result.code
      }
    }
    return { code }
  }
}