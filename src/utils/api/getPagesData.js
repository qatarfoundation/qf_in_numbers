// ES6
const Promise = require('es6-promise').Promise;

// API
const api = require('./index.js');

async function getPagesData() {
    const promises = [
        api.getEntriesByType('year', { locale: 'en-US' }),
        api.getEntriesByType('year', { locale: 'ar-QA' }),
    ];

    const result = await Promise.all(promises);
    const languages = parseLanguages({
        'en-US': result[0],
        'ar-QA': result[1],
    });
    const pages = createPages(languages);

    return pages;
}

function createPages(languages) {
    const pages = [];

    const years = {
        'en-US': languages[0].years,
        'ar-QA': languages[0].years,
    };

    for (let i = 0; i < years['en-US'].length; i++) {
        const yearItem = {
            'en-US': years['en-US'][i],
            'ar-QA': years['ar-QA'][i],
        };
        const yearPath = yearItem['en-US'].year;

        const categories = {
            'en-US': yearItem['en-US'].categories,
            'ar-QA': yearItem['ar-QA'].categories,
        };

        categories['en-US'].forEach((category, index) => {
            const categoryItem = {
                'en-US': categories['en-US'][index],
                'ar-QA': categories['ar-QA'][index],
            };
            const categoryPath = categoryItem['en-US'].slug;

            const subcategories = {
                'en-US': categoryItem['en-US'].subcategories,
                'ar-QA': categoryItem['ar-QA'].subcategories,
            };

            subcategories['en-US'].forEach((subcategory, index) => {
                const subcategoryItem = {
                    'en-US': subcategories['en-US'][index],
                    'ar-QA': subcategories['ar-QA'][index],
                };

                const subcategoryPath = subcategoryItem['en-US'].slug;

                const entities = {
                    'en-US': subcategoryItem['en-US'].entities,
                    'ar-QA': subcategoryItem['ar-QA'].entities,
                };

                entities['en-US'].forEach((entity, index) => {
                    const entityItem = {
                        'en-US': entities['en-US'][index],
                        'ar-QA': entities['ar-QA'][index],
                    };

                    const entityPath = entityItem['en-US'].slug;

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
                });

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
            });

            // Category pages
            pages.push({
                path: categoryPath,
                type: 'category',
                context: {
                    year: yearItem,
                    category: categoryItem,
                },
            });
        });

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

function parseLanguages(data) {
    const languages = [];
    for (const key in data) {
        languages.push({
            locale: key,
            years: parseYears(data[key].items),
        });
    }
    return languages;
}

function parseYears(data) {
    const years = [];
    data.forEach((item) => {
        const fields = item.fields;
        const slug = `/${ fields.year }`;
        years.push({
            year: fields.year,
            slug,
            categories: parseCategories(fields, slug),
        });
    });
    return years;
}

function parseCategories(data, baseSlug) {
    const categories = [];
    if (data.community) categories.push(parseCategory(data.community, baseSlug));
    if (data.education) categories.push(parseCategory(data.education, baseSlug));
    if (data.research) categories.push(parseCategory(data.research, baseSlug));
    return categories;
}

function parseCategory(data, baseSlug) {
    const slug = `${ baseSlug }/${ data.fields.slug }`;
    const category = {
        name: data.fields.name,
        slug,
        subcategories: data.fields && data.fields.subcategories ? parseSubcategories(data.fields.subcategories, slug) : [],
    };
    return category;
}

function parseSubcategories(data, baseSlug) {
    const subcategories = [];
    data.forEach(item => {
        const slug = `${ baseSlug }/${ item.fields.slug }`;
        subcategories.push({
            name: item.fields.name,
            slug,
            entities: item.fields && item.fields.entities ? parseEntities(item.fields.entities, slug) : [],
        });
    });
    return subcategories;
}

function parseEntities(data, baseSlug) {
    const entities = [];
    data.forEach(item => {
        const slug = `${ baseSlug }/${ item.fields.slug }`;
        entities.push({
            name: item.fields.name,
            slug,
            highlighted: item.fields.highlighted,
        });
    });
    return entities;
}

module.exports = getPagesData;
