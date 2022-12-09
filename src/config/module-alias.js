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
  '@modules': path.join(ROOT, 'src', 'modules'),
  '@bootstrap': path.join(ROOT, 'src', 'bootstrap'),
  '@constants': path.join(ROOT, 'src', 'constants'),
  '@jobs': path.join(ROOT, 'src', 'jobs'),
  '@middleware': path.join(ROOT, 'src', 'middleware')
})

module.exports = moduleAlias
