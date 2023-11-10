import {resolve} from 'path'

export default{
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'sync-cc',
            fileName: (format) => `sync-cc.${format}.js`
        }
    }
}