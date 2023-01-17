module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@babel/preset-react'],
  globals: {
    graphql: false,
  },
  parserOptions: {
    ecmaVersion: 8,
    requireConfigFile: false,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
}
