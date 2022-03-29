exports.onCreateWebpackConfig = ({
    actions,
}) => {
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.(sc|c|sa)ss$/,
                    use: [
                        {
                            loader: 'scoped-css-loader',
                        },
                    ],
                },
            ],
        },
    });
};
