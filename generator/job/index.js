const colors = require('colors')

module.exports = plop => {
  plop.load('../utility', {}, {
    helpers: true
  })

  plop.setGenerator('module', {
    description: 'Generate job file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Generate job file:',
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
        path: '../../jobs/{{kebabCase name}}.js',
        templateFile: './templates/job.hbs',
        skipIfExists: false
      }
    ]
  })
}
