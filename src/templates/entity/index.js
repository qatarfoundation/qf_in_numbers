// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Components
import PanelEntity from '@/components/PanelEntity';

function EntityTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
    const data = useTemplateData(props.pageContext, language);
    console.log(data);
    const year = data.year[language];
    const entity = data.entity[language];
    usePopulateTreeDataModel(year.year, year.categories);
    console.log(entity);

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
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });
        timeline.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        return timeline;
    }

    function transitionOut() {
        const timeline = new gsap.timeline({ onComplete: transitionOutCompleted });
        timeline.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
        return timeline;
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    return (
        <div className="template-entity" ref={ el }>
            <PanelEntity />
        </div>
    );
}

export default EntityTemplate;

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
