const pluralize = require('pluralize')
const _snakeCase = require('lodash/snakeCase')
const _kebabCase = require('lodash/kebabCase')
const _camelCase = require('lodash/camelCase')
const _upperFirst = require('lodash/upperFirst')

// helpers
const pascalCase = str => _upperFirst(_camelCase(str))

module.exports = plop => {
  plop.setHelper('plural', txt => pluralize(txt))
  plop.setHelper('pluralSnakeCase', txt => _snakeCase(pluralize(txt)))
  plop.setHelper('pluralKebabCase', txt => _kebabCase(pluralize(txt)))
  plop.setHelper('pluralPascalCase', txt => pascalCase(pluralize(txt)))

  plop.setHelper('singular', txt => pluralize.singular(txt))
  plop.setHelper('singularSnakeCase', txt => _snakeCase(pluralize.singular(txt)))
  plop.setHelper('singularKebabCase', txt => _kebabCase(pluralize.singular(txt)))
  plop.setHelper('singularPascalCase', txt => pascalCase(pluralize.singular(txt)))
}
