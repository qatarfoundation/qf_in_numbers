// Vendor
import gsap, { Power0, Power2 } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql, useStaticQuery } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import '@/pages/home/style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import Drag from '@/assets/icons/drag.svg';
import Select from '@/assets/icons/select.svg';
import { Link } from 'gatsby-plugin-react-i18next';
import useStore from '@/hooks/useStore';
import Tutorial from '@/components/Tutorial/index';

function IndexPage(props, ref) {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const [isInitiation, setIsInitiation] = useState(true);

    /**
     * Stores
     */
    const isTutorial = useStore(s => s.isTutorial);

    /**
     * Effects
     */
    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        if (!isTutorial) useStore.setState({ isTutorial: true });
        Globals.webglApp.disableInteractions();
    }, []);

    useEffect(() => {
        if (titleRef.current) {
            const timeline = new gsap.timeline();
            timeline.to(titleRef.current, 0, { opacity: 1 });
            const amorceSplitText = new SplitText(titleRef.current, { type: 'lines,chars', linesClass: 'line', charsClass: 'char' });
            const lines = amorceSplitText.lines;
            timeline.add('charsLineIn');
            lines.forEach((line, i) => {
                timeline.to(line.querySelectorAll('.char'), 1, { opacity: 1, stagger: 0.015, ease: Power0.easeOut }, 'charsLineIn');
            });
        }
    }, [titleRef]);

    /**
     * Refs
     */
    const el = useRef();
    const titleRef = useRef();

    /**
     * Private
     */
    function transitionIn() {
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });
        timeline.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        timeline.add(Globals.webglApp.showTree(), null, 0);
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

    function clickHandlerButtonInitiation() {
        setIsInitiation(false);
    }

    /**
     * Render
     */
    return (
        <div className="page" ref={ el }>
            <div className="container-page">
                {
                    isInitiation ?
                        <div className="initiation">
                            <h1 ref={ titleRef } className="h4 title">Welcome to Qatar Foundation in Numbers</h1>
                            <p className="p4 label">Click to Enter to continue</p>
                            <button className="button button-enter p4" onClick={ clickHandlerButtonInitiation }>Enter</button>
                            <p className='p4 cookie-sentence'>By entering the site, you agree to our use of cookies. Fore more info check our <Link to={ '/' } className="p4">Privacy Policy</Link></p>
                        </div>
                        :
                        <Tutorial years={ props.data.allContentfulYear.edges } />
                }
            </div>
        </div>
    );
}

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
        allContentfulYear {
            edges {
                node {
                    year
                }
            }
        }
    }
`;
