module.exports = {
    plugins: ['stylelint-scss'],
    extends: ['stylelint-config-recommended'],
    overrides: [
        {
            files: ['**/*.(scss|css)'],
            customSyntax: 'postcss-scss',
        },
    ],
    rules: {
        'no-invalid-double-slash-comments': null,
        'at-rule-no-unknown': null,
        'no-descending-specificity': null,
        'declaration-block-trailing-semicolon': 'always',
    },
};
