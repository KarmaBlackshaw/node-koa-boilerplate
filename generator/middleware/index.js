const colors = require('colors')

module.exports = plop => {
  plop.load('../utility', {}, {
    helpers: true
  })

  plop.setGenerator('module', {
    description: 'Generate middleware',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Generate middleware:',
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
        path: '../../services/http/middleware/{{kebabCase name}}.js',
        templateFile: './templates/middleware.hbs',
        skipIfExists: true
      }
    ]
  })
}
