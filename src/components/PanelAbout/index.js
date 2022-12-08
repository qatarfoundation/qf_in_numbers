// React
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// Vendor
import { gsap } from 'gsap';
import SplitText from '@/assets/scripts/SplitText';
import CustomEase from '@/vendor/gsap/CustomEase';

// Utils
import Scrolls from '@/utils/Scrolls';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

// Components
import ButtonClose from '@/components/ButtonClose';
import Scrollbar from '@/components/ScrollBar';
import Charts from '@/components/Charts';
import ScrollIndicator from '@/components/ScrollIndicator';
import ButtonAboutMoreInfo from '@/components/ButtonAboutMoreInfo';

function PanelAbout(props, ref) {
    /**
     * Data
     */
    const { language } = useI18next();

    /**
     * Refs
     */
    const elRef = useRef();
    const titleRef = useRef();
    const introRef = useRef();
    const chartsListRef = useRef();
    const contentRef = useRef();
    const titleLinesRef = useRef();

    /**
     * Hooks
     */
    const { t } = useTranslation();

    /**
     * Store
     */
    const currentYear = useStore((state) => state.currentYear);
    const previousRoute = useStore((state) => state.previousRoute);

    const timelines = useRef({
        show: null,
        hide: null,
    });

    /**
     * Lifecycle
     */
    useEffect(() => {
        mounted();
        return destroy;
    }, []);

    function mounted() {
        titleLinesRef.current = new SplitText(titleRef.current, {
            type: 'lines',
            linesClass: 'split-line',
        });
        // useStore.setState({ entityShowScrollIndicator: Scrolls['panel-entity'].isVertical });
    }

    function destroy() {
        timelines.current.show?.kill();
        timelines.current.hide?.kill();
    }

    /**
     * Public
     */
    function show() {
        timelines.current.hide?.kill();

        timelines.current.show = new gsap.timeline({ delay: .1 });
        timelines.current.show.to(elRef.current, { duration: 1.5, x: `${ 0 }%`, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, 0);
        timelines.current.show.to(elRef.current, { duration: 0.8, alpha: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.to(contentRef.current, { duration: 1, opacity: 1, ease: 'sine.inOut' }, 0);
        timelines.current.show.to(titleLinesRef.current.lines, { opacity: 1, duration: 0.8, ease: 'none', stagger:0.11 }, .2);
        timelines.current.show.fromTo(titleLinesRef.current.lines, { x: '35%' }, { x:0, duration: 1.6, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1'), stagger:0.11 }, .2);
        timelines.current.show.to(introRef.current, { opacity: 1, duration: 0.7, ease: 'none' }, .45);
        timelines.current.show.fromTo(introRef.current, { x: 250 }, { x:0, duration: 1.4, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1')  }, .45);
        timelines.current.show.to(chartsListRef.current, { opacity: 1, duration: 0.6, ease: 'none' }, 0.63);
        timelines.current.show.fromTo(chartsListRef.current, { x: 160 }, { x:0, duration: 1.2, ease: CustomEase.create('custom', 'M0,0 C0.138,0.168 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1') }, .63);
        return timelines.current.show;
    }

    function hide() {
        const direction = language === 'ar-QA' ? -1 : 1;

        timelines.current.show?.kill();

        timelines.current.hide = new gsap.timeline();
        timelines.current.hide.to(elRef.current, { duration: 1, x: `${ 100 * direction }%`, ease: 'power3.inOut' }, 0);
        timelines.current.hide.to(contentRef.current, { duration: 0.5, opacity: 0, ease: 'sine.inOut' }, 0);
        return timelines.current.hide;
    }

    function buttonCloseClickHandler() {
        history.back();
    }

    /**
     * Expose public
     */
    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    return (
        <div ref={ elRef } className="panel panel-home">

            <Scrollbar revert={ false } calcHeight={ false } name="panel-home">

                <div className="content" ref={ contentRef }>

                    { previousRoute ? <ButtonClose onClick={ buttonCloseClickHandler } /> : <ButtonClose to={ `/${ currentYear }` } /> }

                    <section className="section section-container hide-line">
                        <div className="points">
                            <div className="point"></div>
                            <div className="point"></div>
                            <div className="point"></div>
                        </div>
                        <div className="introduction">
                            <h1 className='h1' ref={ titleRef }>{ props.content.title }</h1>

                            <ScrollIndicator />

                            <p className="p1" ref={ introRef }>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </section>

                    <div className="charts-list" ref={ chartsListRef }>
                        { props.content.charts && <Charts charts={ props.content.charts } combine={ false } /> }
                    </div>

                    <div className="pagination">
                        { props.content.moreInfoTitle && props.content.moreInfoLink &&
                            <ButtonAboutMoreInfo name={ props.content.moreInfoTitle } link={ props.content.moreInfoLink }></ButtonAboutMoreInfo>
                        }
                        <span className="copyright">{ t('Copyright') }</span>
                    </div>

                </div>

            </Scrollbar>

        </div>
    );
}

export default forwardRef(PanelAbout);
