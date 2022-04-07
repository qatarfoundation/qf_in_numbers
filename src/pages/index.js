// Vendor
const contentful = require('contentful');

import React from 'react';
import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import '@/assets/styles/app.scss';
import * as styles from '@/pages/index/style.module.scss';

// Components
import Heading from '@/components/Heading';

const IndexPage = () => {
    const { t } = useTranslation();

    console.log(contentfulQuery);

    return (
        <div className={ styles.page }>
            <div className={ styles.container }>
                <Heading title={ t('heading') } />
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

// export const contentfulQuery = graphql`
//     query MyQuery {
//         allContentfulNumbers {
//             edges {
//                 node {
//                     name
//                 }
//             }
//         }
//     }
// `;
