// Vendor
const path = require('path');

// API
const getPagesData = require('./src/utils/api/getPagesData');

exports.onCreateWebpackConfig = ({ actions, stage, getConfig }) => {
    // NOTE: Set ignore order; This creates conflicts with CSS modules
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin',
    );
    if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);

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

exports.createPages = async({ actions }) => {
    const { createPage } = actions;

    // Templates
    const YearTemplate = path.resolve('src/templates/year/index.js');
    const CategoryTemplate = path.resolve('src/templates/category/index.js');
    const EntityTemplate = path.resolve('src/templates/entity/index.js');

    const templates = {
        year: YearTemplate,
        category: CategoryTemplate,
        subcategory: CategoryTemplate,
        entity: EntityTemplate,
    };

    const pages = await getPagesData();

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        createPage({
            ...page,
            component: templates[page.type],
        });
    }
};
