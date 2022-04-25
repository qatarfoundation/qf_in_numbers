// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// Components
import ListCategories from '@/components/ListCategories';

const YearTemplate = (props) => {
    /**
     * Data
     */
    const { language } = props.pageContext;

    const data = useTemplateData(props.pageContext);

    // Year
    const [year, setYear] = useState(data.year[language]);

    useEffect(() => {
        setYear(data.year[language]);
    }, [data, language]);

    // Categories
    const [categories, setCategories] = useState({
        community: year.community.fields,
        research: year.research.fields,
        education: year.education.fields,
    });

    useEffect(() => {
        setCategories({
            community: year.community.fields,
            research: year.research.fields,
            education: year.education.fields,
        });
    }, [year]);

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    usePopulateTreeDataModel(year, props.data.allContentfulYear);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        // Globals.webglApp.showView('home');
        return gsap.to(el.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-year" ref={ el }>

            <div className="container-page container">

                <ListCategories categories={ categories } />

            </div>

        </div>
    );
};

export default YearTemplate;

export const query = graphql`
    query ($language: String!, $year: Date) {
        locales: allLocale(filter: {language: {eq: $language}}) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
        allContentfulYear(filter: {node_locale: {eq: $language}, year: {eq: $year}}) {
            edges {
                node {
                    year
                    node_locale
                    community {
                        name
                        subcategories {
                            name
                            entities {
                                name
                            }
                        }
                    }
                    research {
                        name
                        subcategories {
                            name
                            entities {
                                name
                            }
                        }
                    }
                    education {
                        name
                        subcategories {
                            name
                            entities {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
