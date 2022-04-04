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
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use: ['raw-loader', 'glslify-loader'],
                },
            ],
        },
    });
};
