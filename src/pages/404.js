// React
import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import '@/assets/styles/app.scss';
import '@/pages/404/style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';
import { Link } from 'gatsby-plugin-react-i18next';

function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <main className='notFoundPage'>
            <div className="container">
                <h1 className='h4'>{ t('We cant find the page you are looking for') }</h1>
                <Link to={ '/' } className={ 'button button-pagination right' }>
                    <div className="icon icon-arrow">
                        <Arrow className={ 'arrow right' } />
                    </div>
                    <p className='p8'>{ t('Back to home') }</p>
                </Link>
            </div>
        </main>
    );
}

export default NotFoundPage;

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
