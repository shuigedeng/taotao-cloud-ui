import { createStyleImportPlugin } from 'vite-plugin-style-import'

export function configStyleImportPlugin() {
  return createStyleImportPlugin({
    libs: [
      {
        libraryName: 'antd',
        esModule: true,
        resolveStyle: name => {
          return `antd/es/${name}/style/index`
        }
      }
    ]
  })
}
