const colors = require('colors')

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

          console.log(colors.bold.red(error))
          console.log(colors.bold.red('Number is not a valid file name!\n'))
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../model/{{ pluralKebabCase name }}.js',
        templateFile: './templates/model.hbs',
        skipIfExists: false
      },
      {
        type: 'add',
        path: '../../services/http/handlers/{{ pluralKebabCase name }}.js',
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
