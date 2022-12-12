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
        validate (input) {
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
        path: '../../src/resources/{{ kebabCase name }}/controller.js',
        templateFile: './templates/controller.hbs',
        skipIfExists: false
      },
      {
        type: 'add',
        path: '../../src/resources/{{ kebabCase name }}/route.js',
        templateFile: './templates/route.hbs',
        skipIfExists: false
      },
      {
        type: 'add',
        path: '../../src/resources/{{ kebabCase name }}/service.js',
        templateFile: './templates/service.hbs',
        skipIfExists: false
      }
    ]
  })
}
