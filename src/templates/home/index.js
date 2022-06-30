// Vendor
import gsap, { Power0, Power2 } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
gsap.registerPlugin(SplitText);

// React
import React, { useEffect, useRef, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql, useStaticQuery } from 'gatsby';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

// Components
import Drag from '@/assets/icons/drag.svg';
import Select from '@/assets/icons/select.svg';
import { Link } from 'gatsby-plugin-react-i18next';
import useStore from '@/hooks/useStore';
import Tutorial from '@/components/Tutorial/index';
import RichText from '@/components/RichText/index';

function HomeTemplate(props, ref) {
    /**
     * Data
     */
    const { language } = props.pageContext;
    const { t } = useTranslation();

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
            new SplitText(titleRef.current, { type: 'lines,chars', linesClass: 'line', charsClass: 'char' });
        }
    }, [titleRef]);

    /**
     * Refs
     */
    const el = useRef();
    const titleRef = useRef();
    const labelRef = useRef();
    const buttonRef = useRef();
    const textButtonRef = useRef();
    const sentenceRef = useRef();

    /**
     * Private
     */
    function transitionIn() {
        const timeline = new gsap.timeline({ onComplete: transitionInCompleted });
        setTimeout(() => {
            timeline.to(titleRef.current, 0, { opacity: 1 });
            const lines = titleRef.current.querySelectorAll('.line');
            timeline.add('charsLineIn');
            lines.forEach((line, i) => {
                timeline.to(line.querySelectorAll('.char'), 1, { opacity: 1, stagger: 0.015, ease: Power0.easeOut }, 'charsLineIn');
            });
            timeline.add('fadeIn');
            timeline.to(labelRef.current, { duration: 0.75, alpha: 1, ease: 'sine.inOut' }, 'fadeIn');
            timeline.to(buttonRef.current, { duration: 0.5, alpha: 1, scale: 1, ease: 'sine.inOut' }, 'fadeIn');
            timeline.to(sentenceRef.current, { duration: 0.75, alpha: 0.5, ease: 'sine.inOut' }, 'fadeIn');
            timeline.to(textButtonRef.current, { duration: 0.7, alpha: 1, y: 0, ease: 'sine.inOut' }, '-=0.45');
            timeline.call(() => Globals.webglApp.showTree(), null, 0.0);
        }, 0);
        return timeline;
    }

    function transitionOut() {
        // const timeline = new gsap.timeline({ onComplete: transitionOutCompleted });
        // timeline.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
        // return timeline;
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    function clickHandlerButtonInitiation() {
        const timeline = new gsap.timeline({ onComplete: () => setIsInitiation(false) });
        const lines = titleRef.current.querySelectorAll('.line');
        timeline.add('fadeOut');
        lines.forEach((line, i) => {
            timeline.to(line.querySelectorAll('.char'), 1, { opacity: 0, stagger: 0.015, ease: Power0.easeIn }, 'fadeOut');
        });
        timeline.to(labelRef.current, { duration: 0.75, alpha: 0, ease: 'sine.inOut' }, 'fadeOut');
        timeline.to(buttonRef.current, { duration: 0.75, alpha: 0, ease: 'sine.inOut' }, 'fadeOut');
        timeline.to(sentenceRef.current, { duration: 0.75, alpha: 0, ease: 'sine.inOut' }, 'fadeOut');
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
                            <h1 ref={ titleRef } className="h4 title">{ props.pageContext.home[language].introduction }</h1>
                            <p ref={ labelRef } className="p4 label">{ t('Click enter to continue') }</p>
                            <button ref={ buttonRef } className="button button-enter p4" onClick={ clickHandlerButtonInitiation }><span ref={ textButtonRef }>{ t('Enter') }</span></button>

                            <div ref={ sentenceRef } className='p4 cookie-sentence'>
                                <RichText data={ props.data.allContentfulGlobal.edges[0].node.cookies } />
                            </div>
                        </div>
                        :
                        <Tutorial years={ props.data.allContentfulYear.edges } heading={ props.pageContext.home[language].heading } tutorial1={ props.pageContext.home[language].tutorial1 } tutorial2={ props.pageContext.home[language].tutorial2 } />
                }
            </div>
        </div>
    );
}

export default HomeTemplate;

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
        allContentfulGlobal(filter: {node_locale: {eq: $language}}) {
            edges {
                node {
                    cookies {
                        raw
                    }
                }
            }
        }
    }
`;
