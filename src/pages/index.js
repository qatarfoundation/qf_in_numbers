// Vendor
import { gsap } from 'gsap';

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

function IndexPage(props, ref) {
    /**
     * States
     */
    const [isPresent, safeToRemove] = usePresence();
    const [isInitiation, setIsInitiation] = useState(true);
    const [isDrag, setIsDrag] = useState(true);
    const [isSelect, setIsSelect] = useState(false);
    const { navigate } = useI18next();

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

    function clickHandlerButtonInitiation() {
        setIsInitiation(false);
    }

    function dragHandlerButtonDrag() {
        setIsDrag(false);
        setIsSelect(true);
    }

    function clickHandlerButtonSelect() {
        navigate(getLastYear());
    }

    function getLastYear() {
        const years = props.data.allContentfulYear.edges;
        years.sort((a, b) => b.node.year - a.node.year);
        return years[0].node.year;
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
                            <button className="button button-enter p4" onClick={ clickHandlerButtonInitiation }>Enter</button>
                            <p className='p4'>By entering the site, you agree to our use of cookies. Fore more info check our <Link to={ '/' } className="p4">Privacy Policy</Link></p>
                        </div>
                        :
                        <div className="tutorial">
                            <h2 className='h6'>Explore the Qatar Foundation in numbers.</h2>
                            { isDrag &&
                            <>
                                <button className="button button-drag" draggable="true" onDragStart={ dragHandlerButtonDrag }>
                                    <div className="icon icon-drag">
                                        <Drag className='drag' />
                                    </div>
                                </button>
                                <p className='p3'>Drag right / left to start experience</p>
                            </>
                            }
                            { isSelect &&
                            <>
                                <button className="button button-select"  onClick={ clickHandlerButtonSelect }>
                                    <div className="icon icon-select">
                                        <Select className='select' />
                                    </div>
                                </button>
                                <p className='p3'>Select a node to explore Numbers</p>
                            </>
                            }
                        </div>
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
