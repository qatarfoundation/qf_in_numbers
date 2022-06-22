// React
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonClose from '@/components/ButtonClose';
import ListYears from '@/components/ListYears';
import Scrollbar from '@/components/ScrollBar';

// Hooks
import useStore from '@/hooks/useStore';
import { useEffect } from 'react';

function PanelYear(props, ref) {
    /**
     * Datas
     */
    const { years } = props;
    const { language } = useI18next();
    /**
     * References
     */
    const panelRef = useRef();
    /**
     * Store
     */
    const isOpen = useStore((state) => state.modalYearIsOpen);
    /**
     * Effects
     */
    useEffect(() => {
        const timeline = new gsap.timeline();
        timeline.fromTo(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? -100 : 100 }, { xPercent: 0, ease: 'ease.easeout' });
        return () => {
            timeline.kill();
        };
    }, []);
    /**
     * Private
     */
    function clickHandler() {
        const timeline = new gsap.timeline({ onComplete: () => { useStore.setState({ modalYearIsOpen: !isOpen }); } });
        timeline.to(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? -100 : 100, ease: 'ease.easein' });
    }
    return (
        <>
            <div ref={ panelRef } className="panel panel-year" data-name="year">
                <div className="header">
                    <p className='label h8'>Year selection</p>
                    <ButtonClose onClick={ clickHandler } />
                </div>
                <Scrollbar revert={ false }>
                    <ListYears years={ years } />
                </Scrollbar>
            </div>
        </>
    );
}

export default PanelYear;
