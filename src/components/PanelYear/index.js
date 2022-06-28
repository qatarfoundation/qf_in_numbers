// React
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Utils
import Globals from '@/utils/Globals';

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
    const { t } = useTranslation();
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
        Globals.webglApp.disableInteractions();

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
        const timeline = new gsap.timeline({
            onComplete: () => {
                useStore.setState({ modalYearIsOpen: !isOpen });
                Globals.webglApp.enableInteractions();
            },
        });
        timeline.to(panelRef.current, 0.5, { xPercent: language !== 'ar-QA' ? -100 : 100, ease: 'ease.easein' });
    }
    return (
        <>
            <div ref={ panelRef } className="panel panel-year" data-name="year">
                <div className="header">
                    <p className='label h8'>{ t('Year selection') }</p>
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
