// React
import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

// CSS
import './style.scoped.scss';

const SubcategoryTemplate = (pageProps) => {
    const subcategory = pageProps.pageContext.name;
    const entities = pageProps.pageContext.entities;

    return (
        <div className="template-subcategory">

            <div className="container">

                <div className="heading">
                    { subcategory }
                </div>

                <ul>
                    { entities.map((entity) => (
                        <li key={ entity.name }>
                            <Link className="button" to={ entity.slug }>
                                { entity.name }
                            </Link>
                        </li>
                    )) }
                </ul>

            </div>

        </div>
    );
};

export default SubcategoryTemplate;

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
