// Vendor
import React from 'react';
import { graphql } from 'gatsby';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/index/style.module.scss';

// Components
import Heading from '@/components/Heading';

const IndexPage = () => {
    return (
        <div className={ styles.page }>
            <div className={ styles.container }>
                <Heading title="Home" />
            </div>
        </div>
    );
};

export default IndexPage;

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
