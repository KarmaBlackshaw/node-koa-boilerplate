const chalk = require('chalk')

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

          console.log(chalk.bold.red(error))
          console.log(chalk.bold.red('Number is not a valid file name!\n'))
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../src/jobs/{{kebabCase name}}.js',
        templateFile: './templates/job.hbs',
        skipIfExists: false
      }
    ]
  })
}
