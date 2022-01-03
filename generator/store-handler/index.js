const chalk = require('chalk')

module.exports = plop => {
  plop.load('../utility', {}, {
    helpers: true
  })

  plop.setGenerator('module', {
    description: 'Generate store and handler module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Generate store and handler module:',
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
        path: '../../store/{{kebabCase name}}.js',
        templateFile: './templates/store.hbs',
        skipIfExists: false
      },
      {
        type: 'add',
        path: '../../services/http/handlers/{{kebabCase name}}.js',
        templateFile: './templates/handler.hbs',
        skipIfExists: true
      }
      // {
      //   type: 'add',
      //   path: '../test/{{kebabCase name}}.js',
      //   templateFile: './modules/testTemplate.js',
      //   skipIfExists: true
      // }
    ]
  })
}
