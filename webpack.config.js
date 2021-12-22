const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@api': resolve('src/service/api'),
      '@components': resolve('src/components'),
      '@config': resolve('src/config'),
      '@mixins': resolve('src/mixins'),
      '@module': resolve('src/module'),
      '@pages': resolve('src/pages'),
      '@service': resolve('src/service'),
      '@static': resolve('src/static'),
      '@status': resolve('src/service/status'),
      '@styles': resolve('src/styles'),
      '@utils': resolve('src/utils'),
    },
  },
}
