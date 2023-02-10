const pluralize = require('pluralize')
const _ = require('lodash')

// helpers
const pascalCase = str => _.upperFirst(_.camelCase(str))

module.exports = plop => {
  plop.setHelper('plural', txt => pluralize(txt))
  plop.setHelper('pluralSnakeCase', txt => _.snakeCase(pluralize(txt)))
  plop.setHelper('pluralKebabCase', txt => _.kebabCase(pluralize(txt)))
  plop.setHelper('pluralPascalCase', txt => pascalCase(pluralize(txt)))

  plop.setHelper('singular', txt => pluralize.singular(txt))
  plop.setHelper('singularSnakeCase', txt => _.snakeCase(pluralize.singular(txt)))
  plop.setHelper('singularKebabCase', txt => _.kebabCase(pluralize.singular(txt)))
  plop.setHelper('singularPascalCase', txt => pascalCase(pluralize.singular(txt)))
}
