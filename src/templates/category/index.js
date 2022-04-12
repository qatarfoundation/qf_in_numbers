// React
import * as React from 'react';
import { useState, useRef } from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

// CSS
import './style.scoped.scss';

const CategoryTemplate = (pageProps) => {
    /**
     * Data
     */
    const category = pageProps.pageContext.name;
    const year = pageProps.pageContext.year;
    const subcategories = pageProps.pageContext.subcategories;
    const slugSubcategories = subcategories.map(item => item.slug);
    const initialSubcategory = pageProps.pageContext.subcategory;

    /**
     * States
     */
    const [activeSubcategoryIndex, setActiveSubcategoryIndex] = useState(initialSubcategory ? slugSubcategories.indexOf(initialSubcategory.slug) : null);

    /**
     * Refs
     */
    const refs = {
        buttonSubcategories: useRef([]),
    };

    /**
     * Private
     */

    /**
     * Handlers
     */
    function subcategoryClickHandler(e) {
        const index = refs.buttonSubcategories.current.indexOf(e.currentTarget);
        setActiveSubcategoryIndex(index);
    }

    return (
        <div className="template-category">

            <div className="container">

                <div className="heading">
                    { category }
                </div>

                <ul className="subcategories-list">
                    { subcategories.map((subcategory, index) => (
                        <li className="subcategories-list-item" key={ subcategory.name } >
                            <button className="button-subcategory button" onClick={ subcategoryClickHandler } ref={ (element) => refs.buttonSubcategories.current.push(element) }>
                                { subcategory.name }
                            </button>

                            {
                                index === activeSubcategoryIndex ?
                                    <ul className="entities-list">
                                        { subcategory.entities.map((entity) => (
                                            <li className="entities-list-item" key={ entity.name }>
                                                <Link className="button-entity button" to={ initialSubcategory.slug ===  subcategory.slug ? `${entity.slug}` : `${pageProps.location.origin}/${year}/${subcategory.slug}/${entity.slug}` }>
                                                    { entity.name }
                                                </Link>
                                            </li>
                                        )) }
                                    </ul> : null
                            }

                        </li>
                    )) }
                </ul>

            </div>

        </div>
    );
};

export default CategoryTemplate;

export const query = graphql`
    query ($language: String!) {
        locales: allLocale(filter: {language: {eq: $language}}) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
    }
`;
