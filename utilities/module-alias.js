// libs
const moduleAlias = require('module-alias')

// node core
const path = require('path')

module.exports = dir => {
  moduleAlias.addAliases({
    '@': path.join(dir),
    '@utilities': path.join(dir, 'utilities'),
    '@helpers': path.join(dir, 'utilities/helpers'),
    '@listeners': path.join(dir, 'listeners'),
    '@jobs': path.join(dir, 'jobs'),
    '@services': path.join(dir, 'services'),
    '@store': path.join(dir, 'store'),
    '@middleware': path.join(dir, 'services', 'http', 'middleware')
  })
}
