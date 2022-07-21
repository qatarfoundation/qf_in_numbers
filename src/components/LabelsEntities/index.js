// React
import { gsap } from 'gsap';
import React, { useRef, useEffect } from 'react';
import { Trans, Link, useTranslation } from 'gatsby-plugin-react-i18next';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import Breakpoints from '@/utils/Breakpoints';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function LabelsEntities(props) {
    const { entities, entityCurrentIndex } = props;

    const { t } = useTranslation();

    const itemsRef = useRef({});
    const itemsLabelRef = useRef({});
    const itemsButtonRef = useRef({});
    const itemsHighlightRef = useRef({});

    useEffect(() => {
        const handler = () => {
            for (const key in itemsLabelRef.current) {
                const elementLabel = itemsLabelRef.current[key];
                const elementHighlight = itemsHighlightRef.current[key];
                const elementButton = itemsButtonRef.current[key];
                const model = TreeDataModel.getEntity(key);

                if (elementLabel && model.labelPosition) {
                    const labelPosition = model.labelPosition;
                    elementLabel.style.display = 'block';
                    elementLabel.style.transform = `translate3d(${ labelPosition.x }px, ${ labelPosition.y }px, 0)`;
                    elementLabel.classList.add(model.cameraSide > 0 ? 'right' : 'left');
                }

                if (elementHighlight) {
                    const hightlightPosition = model.highlightPosition;
                    elementHighlight.style.display = 'block';
                    elementHighlight.style.transform = `translate3d(${ hightlightPosition.x }px, ${ hightlightPosition.y }px, 0)`;
                    elementHighlight.classList.add(model.cameraSide > 0 ? 'right' : 'left');
                }

                if (!Breakpoints.active('small')) {
                    if (elementButton) {
                        const buttonPosition = model.buttonPosition;
                        if (buttonPosition) {
                            elementButton.style.display = 'block';
                            elementButton.style.transform = `translate3d(${ buttonPosition.x }px, ${ buttonPosition.y }px, 0)`;
                            elementButton.classList.add(model.cameraSide > 0 ? 'right' : 'left');
                        }
                    }
                }
            }
        };

        gsap.ticker.add(handler);

        return () => {
            gsap.ticker.remove(handler);
            for (const key in itemsLabelRef.current) {
                const elementLabel = itemsLabelRef.current[key];
                const elementHighlight = itemsHighlightRef.current[key];
                const elementButton = itemsButtonRef.current[key];
                if (elementLabel) {
                    elementLabel.style.display = 'none';
                }
                if (elementHighlight) {
                    elementHighlight.style.display = 'none';
                }
                if (elementButton) {
                    elementButton.style.display = 'none';
                }
            }
        };
    }, [entities]);

    useEffect(() => {
        if (entityCurrentIndex !== null) {
            for (const key in itemsRef.current) {
                const element = itemsRef.current[key];
                if (entities[entityCurrentIndex].slug === key) {
                    gsap.to(element, { duration: 1, delay: 1, opacity: 1 });
                } else {
                    gsap.to(element, { duration: 1, opacity: 0 });
                }
            }
        } else {
            for (const key in itemsRef.current) {
                const element = itemsRef.current[key];
                gsap.to(element, { duration: 1, opacity: 0 });
            }
            // Globals.webglApp.hideCurrentEntity();
        }
    }, [entities, entityCurrentIndex]);

    return (
        <ul>
            {
                entities.map((entity, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[entity.slug] = el }>
                            <div className="label" ref={ el => itemsLabelRef.current[entity.slug] = el }>
                                <span>{ entity.name }</span>
                            </div>
                            <Link to={ entity.slug } className="button" ref={ el => itemsButtonRef.current[entity.slug] = el }>
                                <div className="button__content">
                                    <div className="button__icon"></div>
                                    <span className='button__label'><Trans>{ t('Click to discover') }</Trans></span>
                                </div>
                            </Link>
                            { entity.highlighted &&
                                <div className="highlight" ref={ el => itemsHighlightRef.current[entity.slug] = el }>
                                    <div className="highlight__content">
                                        <span className="highlight__value">{ entity.highlightedChart.value }</span>
                                        <span className="highlight__title">{ entity.highlightedChart.title }</span>
                                    </div>
                                </div>
                            }
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default LabelsEntities;
