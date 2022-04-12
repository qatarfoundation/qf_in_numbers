// React
import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

// CSS
import './style.scoped.scss';

const YearTemplate = (pageProps) => {
    const year = pageProps.pageContext.year;

    return (
        <div className="template-year">

            <div className="container">

                <div className="heading">
                    { year }
                </div>

                <ul>
                    <li>
                        <Link className="button" to={ 'community' }>
                            Community
                        </Link>
                    </li>
                    <li>
                        <Link className="button" to={ 'research' }>
                            Research
                        </Link>
                    </li>
                    <li>
                        <Link className="button" to={ 'education' }>
                            Education
                        </Link>
                    </li>
                </ul>

            </div>

        </div>
    );
};

export default YearTemplate;

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
