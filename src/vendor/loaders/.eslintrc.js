module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parser: 'babel-eslint',
    extends: [
        'standard',
    ],
    rules: {
        'indent': [
            'error', 4,
            {
                'SwitchCase': 1,
            },
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'quote-props': 0,
        'space-before-function-paren': [
            'error',
            {
                'anonymous': 'never',
                'named': 'never',
                'asyncArrow': 'never',
            },
        ],
        'semi': [
            'error',
            'always',
        ],
        'new-cap': 0,
        'import/no-absolute-path': 0,
    },
    ignorePatterns: ['**/vendor/*.js'],
};
