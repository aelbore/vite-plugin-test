import { Plugin, ViteDevServer } from 'vite'
import { getTestFiles, launch } from 'aria-mocha'

export interface TestPluginOptions {
  dir?: string
}

const createUrl = ({ port, hostname, path }) => `http://${hostname}:${port}/${path}`

export default function testPlugin(options?: TestPluginOptions) {
  const { dir } = (options || {})

  const plugin: Plugin = {
    name: 'vite-plugin-test',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/test-files', async (req, res, next) => {
        const files = await getTestFiles(`${dir}/**/*.spec.js`, true)
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(files)
      })

      server.httpServer.on('listening', () => {
        
      })
    }
  }

  return plugin
}