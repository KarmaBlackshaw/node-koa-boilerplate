const chalk = require('chalk')

module.exports = plop => {
  plop.load('../utility', {}, {
    helpers: true
  })

  plop.setGenerator('module', {
    description: 'Generate module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Generate module:',
        validate: function (input) {
          if (isNaN(input)) {
            return true
          }

          const error = [
            '-------------------------------------------------------',
            ':::::::::: :::::::::  :::::::::   ::::::::  :::::::::',
            ':+:        :+:    :+: :+:    :+: :+:    :+: :+:    :+:',
            '+:+        +:+    +:+ +:+    +:+ +:+    +:+ +:+    +:+ ',
            '+#++:++#   +#++:++#:  +#++:++#:  +#+    +:+ +#++:++#:  ',
            '+#+        +#+    +#+ +#+    +#+ +#+    +#+ +#+    +#+ ',
            '#+#        #+#    #+# #+#    #+# #+#    #+# #+#    #+# ',
            '########## ###    ### ###    ###  ########  ###    ### ',
            '-------------------------------------------------------'
          ].join('\n')

          console.log(chalk.bold.red(error))
          console.log(chalk.bold.red('Number is not a valid file name!\n'))
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../services/store/{{ pluralKebabCase name }}.js',
        templateFile: './templates/store.hbs',
        skipIfExists: false
      },
      {
        type: 'add',
        path: '../../services/http/handlers/{{ pluralKebabCase name }}.js',
        templateFile: './templates/handler.hbs',
        skipIfExists: true
      }
    ]
  })
}
