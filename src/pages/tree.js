// React
import React from 'react';
import { graphql } from 'gatsby';

// CSS
import * as styles from '@/pages/tree/style.module.scss';

// Components
import Heading from '@/components/Heading';

const TreePage = () => {
    return (
        <Heading title="Tree" />
    );
};

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
