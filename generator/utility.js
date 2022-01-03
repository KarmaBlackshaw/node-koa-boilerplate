const { snakeCase, kebabCase } = require('lodash')
const pluralize = require('pluralize')

module.exports = plop => {
  plop.setHelper('toPlural', txt => pluralize(txt))
  plop.setHelper('toPluralSnakeCase', txt => snakeCase(pluralize(txt)))
  plop.setHelper('toPluralKebabCase', txt => snakeCase(pluralize(txt)))

  plop.setHelper('toSingular', txt => pluralize.singular(txt))
  plop.setHelper('toSingularSnakeCase', txt => kebabCase(pluralize.singular(txt)))
  plop.setHelper('toSingularKebabCase', txt => kebabCase(pluralize.singular(txt)))
}
