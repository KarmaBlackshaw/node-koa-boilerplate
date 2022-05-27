// libs
const moduleAlias = require('module-alias')

// node core
const path = require('path')

module.exports = dir => {
  moduleAlias.addAliases({
    '@': path.join(dir),
    '@utilities': path.join(dir, 'utilities'),
    '@config': path.join(dir, 'config'),
    '@bootstrap': path.join(dir, 'bootstrap'),
    '@listeners': path.join(dir, 'listeners'),
    '@jobs': path.join(dir, 'jobs'),
    '@services': path.join(dir, 'services'),
    '@model': path.join(dir, 'model'),
    '@middleware': path.join(dir, 'services', 'http', 'middleware')
  })
}
