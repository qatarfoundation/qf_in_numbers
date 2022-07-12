// ES6
const Promise = require('es6-promise').Promise;

// API
const api = require('./index.js');

const fetch = require('node-fetch')

async function getPagesData() {
    const promises = [
        api.getEntriesByType('year', { locale: 'en-US' }),
        api.getEntriesByType('year', { locale: 'ar-QA' }),
        api.getEntryById('6MQqDDNf97Z5Vjof3kZOC7', { locale: 'en-US' }),
        api.getEntryById('6MQqDDNf97Z5Vjof3kZOC7', { locale: 'ar-QA' }),
    ];

    const result = await Promise.all(promises);
    const languages = parseLanguages({
        'en-US': { years: result[0], home: result[2] },
        'ar-QA': { years: result[1], home: result[3] },
    });
    const pages = createPages(languages);

    return pages;
}

function createPages(languages) {
    const pages = [];

    const home = {
        'en-US': languages[0].home,
        'ar-QA': languages[1].home,
    };

    const years = {
        'en-US': languages[0].years,
        'ar-QA': languages[1].years,
    };

    for (let i = 0; i < years['en-US'].length; i++) {
        const yearItem = {
            'en-US': years['en-US'][i],
            'ar-QA': years['ar-QA'][i],
        };
        const yearPath = '/' + yearItem['en-US'].year;

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
                    const previousIndex = index === 0 ? null : index - 1;
                    const currentIndex = index;
                    const nextIndex = index === (entities['en-US'].length - 1) ? null : index + 1;

                    let previousEntityItem;
                    if (previousIndex) {
                        previousEntityItem = {
                            'en-US': entities['en-US'][previousIndex],
                            'ar-QA': entities['ar-QA'][previousIndex],
                        };
                    }

                    const entityItem = {
                        'en-US': entities['en-US'][currentIndex],
                        'ar-QA': entities['ar-QA'][currentIndex],
                    };

                    let nextEntityItem;
                    if (nextIndex) {
                        nextEntityItem = {
                            'en-US': entities['en-US'][nextIndex],
                            'ar-QA': entities['ar-QA'][nextIndex],
                        };
                    }

                    const entityPath = entityItem['en-US'].slug;

                    const data = {
                        'en-US': {
                            previous: previousEntityItem ? previousEntityItem['en-US'] : null,
                            current: entityItem['en-US'],
                            next: nextEntityItem ? nextEntityItem['en-US'] : null,
                        },
                        'ar-QA': {
                            previous: previousEntityItem ? previousEntityItem['ar-QA'] : null,
                            current: entityItem['ar-QA'],
                            next: nextEntityItem ? nextEntityItem['ar-QA'] : null,
                        },
                    };

                    // Create Entity pages
                    pages.push({
                        path: entityPath,
                        context: {
                            home,
                            year: yearItem,
                            category: categoryItem,
                            subcategory: subcategoryItem,
                            entity: data,
                            years,
                            type: 'entity',
                        },
                    });
                });

                // Create Subcategory pages
                pages.push({
                    path: subcategoryPath,
                    context: {
                        home,
                        year: yearItem,
                        category: categoryItem,
                        subcategory: subcategoryItem,
                        years,
                        type: 'subcategory',
                    },
                });
            });

            // Category pages
            pages.push({
                path: categoryPath,
                context: {
                    home,
                    year: yearItem,
                    category: categoryItem,
                    years,
                    type: 'category',
                },
            });
        });

        // Year pages
        pages.push({
            path: yearPath,
            context: {
                home,
                year: yearItem,
                years,
                type: 'year',
            },
        });
    }

    // Home page
    pages.push({
        path: '/',
        context: {
            home,
            years,
            type: 'home',
        },
    });

    return pages;
}

function parseLanguages(data) {
    const languages = [];
    for (const key in data) {
        languages.push({
            locale: key,
            home: data[key].home.fields,
            years: parseYears(data[key].years.items),
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
            id: fields.year,
            slug,
            categories: parseCategories(fields, slug),
        });
    });
    return orderYears(years);
}

function orderYears(years) {
    const orderedYears = years.sort((a, b) => {
        return parseInt(b.year) - parseFloat(a.year);
    });
    return orderedYears;
}

function parseCategories(data, baseSlug) {
    const categories = [];
    categories.push(parseCategory('Community', data.community, baseSlug));
    categories.push(parseCategory('Research', data.research, baseSlug));
    categories.push(parseCategory('Education', data.education, baseSlug));
    return categories;
}

function parseCategory(name, data, baseSlug) {
    let category;
    if (data) {
        const slug = `${ baseSlug }/${ data.fields.slug }`;
        category = {
            name: data.fields.name,
            id: data.fields.slug,
            slug,
            subcategories: data.fields && data.fields.subcategories ? parseSubcategories(data.fields.subcategories, slug) : [],
        };
    } else {
        category = {
            name,
            id: 'null',
            slug: 'null',
            subcategories: [],
        };
    }

    return category;
}

function parseSubcategories(data, baseSlug) {
    const subcategories = [];
    data.forEach(item => {
        const slug = `${ baseSlug }/${ item.fields.slug }`;
        subcategories.push({
            name: item.fields.name,
            id: item.fields.slug,
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
        const data = {
            name: item.fields.name,
            id: item.fields.slug,
            slug,
            highlighted: item.fields.highlighted,
            charts: item.fields.charts,
            relatedArticles: item.fields.relatedArticles,
            tags: item.fields.tags,
        };

        if (item.fields.description) {
            data.description = item.fields.description.content[0].content[0].value;
        } else {
            data.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        }
        if (item.fields.highlightedChart) data.highlightedChart = item.fields.highlightedChart.fields;
        if (data.charts) data.charts = parseCharts(data.charts);
        if (data.relatedArticles) data.relatedArticles = parseRelatedArticles(data.relatedArticles);
        if (data.tags) data.tags = parseTags(data.tags);
        entities.push(data);
    });
    return entities;
}

function parseCharts(data) {
    const charts = [];
    data.forEach(item => {
        if (item) {
            if (item.fields && item.sys) {
                let chart = {};
                chart = parseChart(item.fields, item.sys.contentType.sys.id);
                chart.type = item.sys.contentType.sys.id;
                charts.push(chart);
            }
        }
    });
    return charts;
}

function parseChart(data, type) {
    let chart = {};
    if (data.title) {
        chart.title = data.title.content[0].content;
        chart.title = chart.title.map(t => {
            return {
                value: t.value,
                bold: t.marks.length !== 0 && t.marks[0].type == 'bold',
            };
        });
    }
    if (data.subtitle) chart.subtitle = data.subtitle;
    if (data.labelTooltip) chart.labelTooltip = data.labelTooltip;
    switch (type) {
        case 'kpiChart':
            chart = { ...chart, ...parseKPIChart(data) };
            break;
        case 'heatmapChart':
            chart = { ...chart, ...parseHeatmapChart(data) };
            break;
        case 'barChart':
            chart = { ...chart, ...parseBarChart(data) };
            break;
        case 'donutChart':
            chart = { ...chart, ...parseDonutChart(data) };
            break;
        case 'lineChart':
            chart = { ...chart, ...parseLineChart(data) };
            break;
        case 'bubbleChart':
            chart = { ...chart, ...parseBubbleChart(data) };
            break;
        case 'mapChart':
            chart = { ...chart, ...parseMapChart(data) };
            break;
        case 'beeswarmChart':
            chart = { ...chart, ...parseBeeswarmChart(data) };
            break;
    }
    return chart;
}

function parseKPIChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        data.dataItems.forEach(item => {
            const field = {
                name: item.fields.title,
                value: item.fields.value,
            };
            if (item.fields.icon) {
                field.icon = {};
                field.icon.url = item.fields.icon.fields.file.url;
                field.icon.alt = item.fields.icon.fields.title;
            }
            chart.fields.push(field);
        });
        return chart;
    } else {
        return {};
    }
}

function parseHeatmapChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        data.dataRows.forEach(itemRow => {
            itemRow.fields.dataItems.forEach(item => {
                const field = {
                    group: itemRow.fields.title,
                    name: item.fields.title,
                    value: item.fields.value,
                };
                chart.fields.push(field);
            });
        });
        const maxValue = Math.max(...chart.fields.map(a => a.value));
        chart.fields.forEach(item => {
            item.percent = Math.floor(item.value * 100 / maxValue);
        });
        return chart;
    } else {
        return {};
    }
}

function parseBarChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        data.dataItems.forEach(item => {
            const field = {
                name: item.fields.title,
                value: item.fields.value,
            };
            if (item.fields.additionalInformation) field.additionalInformation = item.fields.additionalInformation;
            chart.fields.push(field);
        });
        return chart;
    } else {
        return {};
    }
}

function parseDonutChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
            name: data.dataTitle,
            length: 0,
        };
        data.dataItems.forEach(item => {
            const field = {
                name: item.fields.title,
                value: item.fields.value,
            };
            chart.fields.push(field);
            chart.length += item.fields.value;
        });
        const maxValue = Math.max(...chart.fields.map(a => a.value));
        chart.fields.forEach(item => {
            item.percent = Math.floor(item.value * 100 / chart.length);
        });
        return chart;
    } else {
        return {};
    }
}

function parseLineChart(data) {
    if (data.lines) {
        const chart = {
            fields: [],
            labelX: data.labelX,
            labelY: data.labelY,
        };
        data.lines.forEach(lineItem => {
            const line = {
                name: lineItem.fields.title,
                fields: [],
            };
            lineItem.fields.points.forEach(point => {
                const field = {
                    name: point.fields.title,
                    x: point.fields.valueX,
                    y: point.fields.valueY,
                };
                line.fields.push(field);
            });
            chart.fields.push(line);
        });
        return chart;
    } else {
        return {};
    }
}

function parseBubbleChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        data.dataItems.forEach(item => {
            const field = {
                name: item.fields.title,
                value: item.fields.value,
            };
            chart.fields.push(field);
        });
        return chart;
    } else {
        return {};
    }
}

function parseMapChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        if (data.worldMap) chart.worldMap = data.worldMap;
        data.dataItems.forEach(async (item) => {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${item.fields.place}.json?types=place%2Ccountry&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`)
            const geoData = await res.json()
            let coords = geoData.features?.length ? geoData.features[0].geometry?.coordinates : [0, 0]

            const field = {
                place: item.fields.place,
                value: item.fields.value,
                long: coords[0],
                lat: coords[1]
            };
            chart.fields.push(field);
        });
        return chart;
    } else {
        return {};
    }
}

function parseBeeswarmChart(data) {
    if (data.dataItems || data.dataRows) {
        const chart = {
            fields: [],
        };
        data.dataItems.forEach(item => {
            const field = {
                group: item.fields.title,
                value: item.fields.value,
            };
            if (item.fields.color) field.color = item.fields.color;
            chart.fields.push(field);
        });
        return chart;
    } else {
        return {};
    }
}

function parseRelatedArticles(data) {
    const articles = [];
    data.forEach(item => {
        const article = item.fields;
        article.description = typeof article.description === 'string' ? article.description : article.description.content[0].content[0].value;
        articles.push(article);
    });
    return articles;
}

function parseTags(data) {
    const tags = [];
    data.forEach(item => {
        const tag = item.fields;
        tags.push(tag);
    });
    return tags;
}

module.exports = getPagesData;
