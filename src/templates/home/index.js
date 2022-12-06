// Vendor
import gsap from 'gsap';
import SplitText from '@/assets/scripts/SplitText';

// React
import React, { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';

// CSS
import './style.scoped.scss';

// Components
import RichText from '@/components/RichText/index';
import ButtonStart from '@/components/ButtonStart/index';
import Globals from '@/utils/Globals';

function HomeTemplate(props, ref) {
    /**
     * Data
     */
    const { language } = props.pageContext;
    const data = useTemplateData(props.pageContext, language);
    const { t } = useTranslation();
    const currentYear = data.years['en-US'][0];

    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();

    /**
     * Refs
     */
    const el = useRef();
    const titleRef = useRef();
    const labelRef = useRef();
    const buttonRef = useRef();
    const cookieRef = useRef();
    const timelines = useRef({
        transitionIn: null,
        transitionOut: null,
    });
    const headingLinesSplitText = useRef();

    /**
     * Watchers
     */
    useEffect(() => {
        // if (isPresent) transitionIn();
        if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy();
    }, []);

    function mounted() {
        headingLinesSplitText.current = new SplitText(titleRef.current, {
            type: 'lines',
            linesClass: 'split-line',
        });

        transitionIn();
    }

    function destroy() {

    }

    /**
     * Private
     */
    function transitionIn() {
        timelines.current.transitionOut?.kill();

        timelines.current.transitionIn = new gsap.timeline({ onComplete: transitionInCompleted, delay: 0 });

        timelines.current.transitionIn.add(Globals.webglApp.transitionIn(), 0);
        timelines.current.transitionIn.to(el.current, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.transitionIn.to(headingLinesSplitText.current.lines, { duration: 1.5, alpha: 1, stagger: 0.1, ease: 'sine.inOut' }, 0);
        timelines.current.transitionIn.to(headingLinesSplitText.current.lines, { duration: 1.5, rotation: '0deg', stagger: 0.1, ease: 'power3.out' }, 0);
        timelines.current.transitionIn.to(headingLinesSplitText.current.lines, { duration: 1.5, y: '0%', stagger: 0.1, ease: 'power3.out' }, 0);
        timelines.current.transitionIn.to(labelRef.current, { duration: 1.5, alpha: 1, ease: 'sine.inOut' }, 0.2);
        timelines.current.transitionIn.add(buttonRef.current.show(), 0.5);
        timelines.current.transitionIn.to(cookieRef.current, { duration: 1.5, alpha: 1, ease: 'sine.inOut' }, 1);
    }

    function transitionOut() {
        timelines.current.transitionIn?.kill();
        Globals.webglApp.disableIdleRotation();

        timelines.current.transitionOut = new gsap.timeline({ onComplete: transitionOutCompleted });

        timelines.current.transitionOut.add(buttonRef.current.hide(), 0);
        timelines.current.transitionOut.to(el.current, { duration: 1, alpha: 0, ease: 'sine.inOut' }, 0);
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        safeToRemove();
    }

    /**
     * Render
     */
    return (
        <div className="page-home" ref={ el }>

            <div className="initiation">

                <h1 ref={ titleRef } className="h4 title">{ data.home[language].introduction }</h1>

                <p ref={ labelRef } className="p4 label">{ t('Click enter to continue') }</p>

                <ButtonStart ref={ buttonRef } to={ currentYear.slug } label={ t('Enter') } className="button button-enter p4" />

            </div>

            <div ref={ cookieRef } className='p4 cookie'>
                <RichText data={ props.data.allContentfulGlobal.edges[0].node.cookies } />
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
