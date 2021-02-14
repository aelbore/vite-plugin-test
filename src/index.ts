import { Plugin, ViteDevServer } from 'vite'
import { getTestFiles, launch } from 'aria-mocha'
import { transformSync, Loader } from 'esbuild'
 
import { IncomingMessage, ServerResponse } from 'http'
import { AddressInfo } from 'net'
import { Stats, existsSync } from 'fs'
import path from 'path'


async function launchHeadless({ hostname, port, path, watch }) {
  await launch(createUrl({ hostname, port, path }))
  ;(!watch && process.exit())
}

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

const getExt = (str: string) => {
  const basename = path.basename(str);
  const firstDot = basename.indexOf('.');
  const lastDot = basename.lastIndexOf('.');
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');

  if (firstDot === lastDot) return extname

  return basename.slice(firstDot, lastDot) + extname
}

export interface TestPluginOptions {
  dir?: string
  watch?: boolean
  loaders?: {
    [ext: string]: Loader
  }
}

export default function viteTestPlugin(options?: TestPluginOptions) {
  let { dir = 'tests', watch = false, loaders } = (options || {})
  
  let port = 3000
  let hostname = 'localhost'
  let indexPath =  'node_modules/vite-plugin-test/index.html'

  const plugin: Plugin = {
    name: 'vite-plugin-test',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/test-files', async (_req: IncomingMessage, res: ServerResponse, _next: Function) => {
        const files = existsSync(dir) ? await getTestFiles(`${dir}/**/*.spec.js`, true): []
        res.writeHead(200, {
          'Content-type': 'application/json'
        })
        res.end(JSON.stringify(files))
      })

      server.watcher.on('change', async (path: string, stats: Stats) => {
        await launchHeadless({ hostname, port, watch, path: indexPath })
      })

      server.httpServer?.on('listening', async () => {
        const address = server.httpServer?.address() as AddressInfo

        hostname = address.address === '::' ? 'localhost': address.address
        port = address.port

        await launchHeadless({ hostname, port, watch, path: indexPath })
      })
    },
    transform(code: string, id: string) {
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

  return plugin
}
