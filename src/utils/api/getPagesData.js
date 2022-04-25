// ES6
const Promise = require('es6-promise').Promise;

// API
const api = require('./index.js');

async function getPagesData() {
    const pages = [];

    const promises = [
        api.getEntriesByType('year', { locale: 'en-US' }),
        api.getEntriesByType('year', { locale: 'ar-QA' }),
    ];

    const result = await Promise.all(promises);

    const years = {
        'en-US': result[0].items,
        'ar-QA': result[1].items,
    };

    for (let i = 0; i < years['en-US'].length; i++) {
        const yearItem = {
            'en-US': years['en-US'][i].fields,
            'ar-QA': years['ar-QA'][i].fields,
        };

        const categories = {
            'en-US': {
                community: yearItem['en-US'].community.fields,
                research: yearItem['en-US'].research.fields,
                education: yearItem['en-US'].education.fields,
            },
            'ar-QA': {
                community: yearItem['ar-QA'].community.fields,
                research: yearItem['ar-QA'].research.fields,
                education: yearItem['ar-QA'].education.fields,
            },
        };

        for (const categoryKey in categories['en-US']) {
            const categoryItem = {
                'en-US': categories['en-US'][categoryKey],
                'ar-QA': categories['ar-QA'][categoryKey],
            };

            const subcategories = {
                'en-US': categoryItem['en-US'].subcategories,
                'ar-QA': categoryItem['ar-QA'].subcategories,
            };

            for (let j = 0; j < subcategories['en-US'].length; j++) {
                const subcategoryItem = {
                    'en-US': subcategories['en-US'][j].fields,
                    'ar-QA': subcategories['ar-QA'][j].fields,
                };

                const entities = {
                    'en-US': subcategoryItem['en-US'].entities,
                    'ar-QA': subcategoryItem['ar-QA'].entities,
                };

                for (let k = 0; k < entities['en-US'].length; k++) {
                    const entityItem = {
                        'en-US': entities['en-US'][k].fields,
                        'ar-QA': entities['ar-QA'][k].fields,
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