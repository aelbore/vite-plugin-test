import { Plugin, ViteDevServer } from 'vite'
import { getTestFiles, launch } from 'aria-mocha'
import { IncomingMessage, ServerResponse } from 'http'
import { AddressInfo } from 'net'
import { Stats } from 'fs'

async function launchHeadless({ hostname, port, path, watch }) {
  await launch(createUrl({ hostname, port, path }))
  ;(!watch && process.exit())
}

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

export interface TestPluginOptions {
  dir?: string
  watch?: boolean
}

export default function viteTestPlugin(options?: TestPluginOptions) {
  let { dir = 'tests', watch = false } = (options || {})
  
  let port = 3000
  let hostname = 'localhost'
  let indexPath =  'node_modules/vite-plugin-test/index.html'

  const plugin: Plugin = {
    name: 'vite-plugin-test',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/test-files', async (_req: IncomingMessage, res: ServerResponse, _next: Function) => {
        const files = await getTestFiles(`${dir}/**/*.spec.js`, true)
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
    }
  }

  return plugin
}
