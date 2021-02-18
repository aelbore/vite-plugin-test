import path from 'path'
import { existsSync, promises, Stats } from 'fs'
import { AddressInfo } from 'net'
import { IncomingMessage, ServerResponse } from 'http'

import { ViteDevServer } from 'vite'
import { globFiles, launch } from 'aria-mocha'

import { TestPluginOptions } from './options'

const patterns = () => [ 
  '**/*.spec.ts', 
  '**/*.spec.js', 
  '**/*.spec.jsx', 
  '**/*.spec.tsx', 
  '**/*.test.ts',  
  '**/*.test.js', 
  '**/*.test.jsx', 
  '**/*.test.tsx',  
]

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

async function launchHeadless({ hostname, port, path, watch }) {
  await launch(createUrl({ hostname, port, path }))
  ;(!watch && process.exit())
}

async function getFiles(file: string, relative: boolean) {
  const stat = await promises.lstat(file)
  return stat.isDirectory() 
    ? await globFiles(patterns().map(pattern => path.join(file, pattern)), relative)
    : stat.isFile() ? [ file ]: []
}

export function configureServer(options: TestPluginOptions) {
  const { dir = 'tests', watch = false } = (options || {})
  
  let port = 3000, hostname = 'localhost', indexPath =  'node_modules/vite-plugin-test/index.html'

  return (server: ViteDevServer) => {
    server.middlewares.use('/test-files', async (_req: IncomingMessage, res: ServerResponse, _next: Function) => {
      const files = existsSync(dir) ? await getFiles(dir, true): []
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