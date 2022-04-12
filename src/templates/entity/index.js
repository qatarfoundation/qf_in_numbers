// React
import * as React from 'react';
import { graphql } from 'gatsby';

// CSS
import './style.scoped.scss';

const EntityTemplate = (pageProps) => {
    const entity = pageProps.pageContext.name;

    return (
        <div className="template-entity">

            <div className="container">

                <div className="heading">
                    { entity }
                </div>

            </div>

        </div>
    );
};

export default EntityTemplate;

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
