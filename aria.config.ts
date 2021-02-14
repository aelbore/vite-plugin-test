import { defineConfig, mkdir, copyFile, symlinkDir } from 'aria-build'

export default defineConfig({
  plugins: [
    {
      name: 'copy',
      buildEnd: async () => {
        await mkdir('dist', { recursive: true })
        await copyFile('./src/index.html', './dist/index.html')
        await Promise.all([
          symlinkDir('./dist', './node_modules/vite-plugin-test'),
          symlinkDir('./node_modules', './example/node_modules')
        ])
      }
    }
  ]
})