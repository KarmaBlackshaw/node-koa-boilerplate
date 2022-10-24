// libs
const moduleAlias = require('module-alias')

// node core
const path = require('path')

// constants
const ROOT = process.cwd()

moduleAlias.addAliases({
  '@': path.join(ROOT),
  '@utilities': path.join(ROOT, 'utilities'),
  '@config': path.join(ROOT, 'config'),
  '@bootstrap': path.join(ROOT, 'bootstrap'),
  '@listeners': path.join(ROOT, 'listeners'),
  '@jobs': path.join(ROOT, 'jobs'),
  '@helpers': path.join(ROOT, 'helpers'),
  '@constants': path.join(ROOT, 'constants'),
  '@store': path.join(ROOT, 'services/store'),
  '@middleware': path.join(ROOT, 'services', 'http', 'middleware')
})

module.exports = moduleAlias
