const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('react-ts', {
  rules: {
    'jsx-quotes': 0,
    'object-property-newline': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-wrap-multilines': 0,
    'react/jsx-closing-tag-location': 0,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-first-prop-new-line': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-shadow': 0,
  },
});
