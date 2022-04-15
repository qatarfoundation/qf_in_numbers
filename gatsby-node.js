const path = require('path');
const slugify = require('slugify');

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

exports.createPages = async({ graphql, actions }) => {
    const { createPage, createRedirect } = actions;

    // Templates
    const YearTemplate = path.resolve('src/templates/year/index.js');
    const CategoryTemplate = path.resolve('src/templates/category/index.js');
    const SubcategoryTemplate = path.resolve('src/templates/subcategory/index.js');
    const EntityTemplate = path.resolve('src/templates/entity/index.js');

    const result = await graphql(`
        query {
            allContentfulYear(filter: {node_locale: {eq: "en-US"}}) {
                edges {
                    node {
                        year
                        node_locale
                        community {
                            name
                            subcategories {
                                name
                                entities {
                                    name
                                }
                            }
                        }
                        research {
                            name
                            subcategories {
                                name
                                entities {
                                    name
                                }
                            }
                        }
                        education {
                            name
                            subcategories {
                                name
                                entities {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `);

    // Generate routes
    const yearEdges = result.data.allContentfulYear.edges;

    yearEdges.forEach((yearEdge) => {
        const year = yearEdge.node;

        const categories = {
            community: year.community,
            research: year.research,
            education: year.education,
        };

        for (const key in categories) {
            const category = categories[key];
            category.slug = slugify(category.name.toLowerCase());

            const subcategories = category.subcategories;
            subcategories.forEach((subcategory) => {
                subcategory.slug = slugify(subcategory.name.toLowerCase());

                const entities = subcategory.entities;
                entities.forEach((entity) => {
                    entity.slug = slugify(entity.name.toLowerCase());

                    // Entity pages
                    createPage({
                        path: `${year.year}/${key}/${subcategory.slug}/${entity.slug}`,
                        component: EntityTemplate,
                        context: entity,
                    });
                });

                // Subcategory pages
                createPage({
                    path: `${year.year}/${key}/${subcategory.slug}`,
                    component: CategoryTemplate,
                    context: {
                        ...category,
                        year,
                        subcategory,
                    },
                });
            });

            // Category pages
            createPage({
                path: `${year.year}/${key}`,
                component: CategoryTemplate,
                context: {
                    ...category,
                    year,
                },
            });
        }

        // Year pages
        createPage({
            path: `${year.year}`,
            component: YearTemplate,
            context: year,
        });
    });

    // Redirect ot default year
    // createRedirect({
    //     fromPath: '',
    //     toPath: '/2021',
    // });
};
