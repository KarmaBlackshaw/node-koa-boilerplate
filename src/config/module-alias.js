// libs
const moduleAlias = require('module-alias')

// node core
const path = require('path')

// constants
const ROOT = process.cwd()

moduleAlias.addAliases({
  '@': path.join(ROOT, 'src'),
  '@utilities': path.join(ROOT, 'src', 'utilities'),
  '@config': path.join(ROOT, 'src', 'config'),
  '@bootstrap': path.join(ROOT, 'src', 'bootstrap'),
  '@listeners': path.join(ROOT, 'src', 'listeners'),
  '@jobs': path.join(ROOT, 'src', 'jobs'),
  '@store': path.join(ROOT, 'src', 'services/store'),
  '@middleware': path.join(ROOT, 'src', 'services', 'http', 'middleware')
})

module.exports = moduleAlias
