module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },

  parserOptions: {
    ecmaVersion: 2018
  },

  extends: ['standard'],

  rules: {
    indent: ['error', 2],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error', { before: false, after: true }],
    'prefer-const': 'error',
    'arrow-parens': [2, 'as-needed'],
    'no-await-in-loop': 'error',
    'no-console': 'off',
    'no-useless-catch': 'off',
    'object-curly-spacing': ['error', 'always'],
    'no-unused-vars': ['error',
      {
        argsIgnorePattern: 'next|_.+',
        varsIgnorePattern: '_'
      }
    ],
    'default-case': 'error'
  }
}
