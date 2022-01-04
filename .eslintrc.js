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
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-useless-catch': 'off',
    eqeqeq: 'off',
    'prefer-regex-literals': 'off',
    'default-case': 'off',
    'comma-dangle': ['error', 'never'],
    'prefer-const': 'error',
    'arrow-parens': [2, 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    curly: [2, 'all'],
    indent: ['error', 2, {
      SwitchCase: 1
    }],
    'comma-spacing': ['error', {
      before: false, after: true
    }],
    'brace-style': ['error', '1tbs', {
      allowSingleLine: false
    }],
    'no-unused-vars': ['error',
      {
        argsIgnorePattern: 'next|_.+',
        varsIgnorePattern: '_'
      }
    ]
  }
}
