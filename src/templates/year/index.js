// Vendor
import { gsap } from 'gsap';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

const YearTemplate = (props, ref) => {
    /**
     * Data
     */
    const year = props.pageContext.year;
    const { originalPath } = useI18next();

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Effects
     */
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

    console.log();

    return (
        <div className="template-year" ref={ el }>

            <div className="container">

                <div className="heading">
                    { year }
                </div>

                <ul>
                    <li>
                        <Link className="button" to={ `${originalPath}/community` }>
                            Community
                        </Link>
                    </li>
                    <li>
                        <Link className="button" to={ `${originalPath}/research` }>
                            Research
                        </Link>
                    </li>
                    <li>
                        <Link className="button" to={ `${originalPath}/education` }>
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
