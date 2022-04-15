// React
import React from 'react';
import { graphql } from 'gatsby';

// CSS
import '@/pages/tree/style.scoped.scss';

// Components
import MainCategories from '@/components/MainCategories';

function TreePage() {
    return (
        <>
            <MainCategories />
        </>
    );
}

export default TreePage;

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
