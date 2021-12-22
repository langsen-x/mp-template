const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@api', resolve('src/service/api'))
      .set('@components', resolve('src/components'))
      .set('@config', resolve('src/config'))
      .set('@mixins', resolve('src/mixins'))
      .set('@module', resolve('src/module'))
      .set('@pages', resolve('src/pages'))
      .set('@service', resolve('src/service'))
      .set('@static', resolve('src/static'))
      .set('@status', resolve('src/service/status'))
      .set('@styles', resolve('src/styles'))
      .set('@utils', resolve('src/utils'))
  },
}
