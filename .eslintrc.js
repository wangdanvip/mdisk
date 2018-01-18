module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 'semi':['error','always'],
    'semi': 0,
    'indent':0, //配置了0代表不检测
    'space-before-function-paren': 0,
    'no-new': 0,
    'key-spacing': 0,
    'no-trailing-spaces': 0,
    'no-multiple-empty-lines': 0,
    'spaced-comment': 0,
    'quotes': 0,
    'space-before-blocks':0,
    'padded-blocks':0,
    'space-infix-ops':0,
    'keyword-spacing':0,
    'semi-spacing':0,
    'no-unused-vars':0,
    'comma-spacing':0,
    'camelcase':0,
    'no-tabs':0,
    'comma-dangle':0,
    'eol-last':0,
    'no-multi-spaces':0,
    'dot-location':0,
    'new-cap':0,
    'eqeqeq':0,
    'no-throw-literal':0
  }
};
