module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  parser: "babel-eslint",
  extends: ["eslint:recommended"],
  rules: {
    quotes: [2, "single"],
    "no-unused-vars": [2, { ignoreRestSiblings: true }],
    "no-console": 0,
    "no-debugger": 2,
    semi: 2,
    eqeqeq: 2,
    "comma-dangle": 0,
    "no-plusplus": 0,
    "key-spacing": 0,
    "comma-spacing": 0,
    "arrow-body-style": 1,
    "global-require": 0,
    "object-curly-spacing": 0,
    "import/no-extraneous-dependencies": 0,
    "import/first": 0,
    "max-len": [
      2,
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    "max-lines": [
      2,
      {
        max: 500,
        skipBlankLines: true,
        skipComments: true
      }
    ]
  }
};
