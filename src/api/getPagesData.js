// ES6
const Promise = require('es6-promise').Promise;

// API
const api = require('./index.js');

async function getPagesData() {
    const pages = [];

    const promises = [
        api.getEntriesByType('year', { locale: 'en-US' }),
        api.getEntriesByType('year', { locale: 'ar' }),
    ];

    const result = await Promise.all(promises);

    const years = {
        'en-US': result[0].items,
        'ar': result[1].items,
    };

    for (let i = 0; i < years['en-US'].length; i++) {
        const yearItem = {
            'en-US': years['en-US'][i].fields,
            'ar': years['ar'][i].fields,
        };

        const categories = {
            'en-US': {
                community: yearItem['en-US'].community.fields,
                research: yearItem['en-US'].research.fields,
                education: yearItem['en-US'].education.fields,
            },
            'ar': {
                community: yearItem['ar'].community.fields,
                research: yearItem['ar'].research.fields,
                education: yearItem['ar'].education.fields,
            },
        };

        for (const categoryKey in categories['en-US']) {
            const categoryItem = {
                'en-US': categories['en-US'][categoryKey],
                'ar': categories['ar'][categoryKey],
            };

            const subcategories = {
                'en-US': categoryItem['en-US'].subcategories,
                'ar': categoryItem['ar'].subcategories,
            };

            for (let j = 0; j < subcategories['en-US'].length; j++) {
                const subcategoryItem = {
                    'en-US': subcategories['en-US'][j].fields,
                    'ar': subcategories['ar'][j].fields,
                };

                const entities = {
                    'en-US': subcategoryItem['en-US'].entities,
                    'ar': subcategoryItem['ar'].entities,
                };

                for (let k = 0; k < entities['en-US'].length; k++) {
                    const entityItem = {
                        'en-US': entities['en-US'][k].fields,
                        'ar': entities['ar'][k].fields,
                    };

                    const entityPath = `${yearItem['en-US'].year}/${categoryItem['en-US'].slug}/${subcategoryItem['en-US'].slug}/${entityItem['en-US'].slug}`;

                    // Create Entity pages
                    pages.push({
                        path: entityPath,
                        type: 'entity',
                        context: {
                            year: yearItem,
                            category: categoryItem,
                            subcategory: subcategoryItem,
                            entity: entityItem,
                        },
                    });
                }

                const subcategoryPath = `${yearItem['en-US'].year}/${categoryItem['en-US'].slug}/${subcategoryItem['en-US'].slug}`;

                // Create Subcategory pages
                pages.push({
                    path: subcategoryPath,
                    type: 'subcategory',
                    context: {
                        year: yearItem,
                        category: categoryItem,
                        subcategory: subcategoryItem,
                    },
                });
            }

            const categoryPath = `${yearItem['en-US'].year}/${categoryItem['en-US'].slug}`;

            // Category pages
            pages.push({
                path: categoryPath,
                type: 'category',
                context: {
                    year: yearItem,
                    category: categoryItem,
                },
            });
        }

        const yearPath = `${yearItem['en-US'].year}`;

        // Year pages
        pages.push({
            path: yearPath,
            type: 'year',
            context: {
                year: yearItem,
            },
        });
    }

    return pages;
}

module.exports = getPagesData;