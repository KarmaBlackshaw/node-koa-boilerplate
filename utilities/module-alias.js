const moduleAlias = require('module-alias')

module.exports = dir => {
  moduleAlias.addAliases({
    '@': `${dir}`,
    '@utilities': `${dir}/utilities`,
    '@listeners': `${dir}/listeners`,
    '@jobs': `${dir}/jobs`,
    '@services': `${dir}/services`,
    '@store': `${dir}/store`,
    '@middleware': `${dir}/services/http/middleware`
  })
}
