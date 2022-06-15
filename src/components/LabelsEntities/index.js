// React
import { gsap } from 'gsap';
import React, { useRef, useEffect } from 'react';
import { Trans } from 'gatsby-plugin-react-i18next';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';
import Breakpoints from '@/utils/Breakpoints';

function LabelsEntities(props) {
    const { entities } = props;

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

                if (elementLabel) {
                    const labelPosition = model.labelPosition;
                    elementLabel.style.display = 'block';
                    elementLabel.style.transform = `translate(${ labelPosition.x }px, ${ labelPosition.y }px)`;
                    elementLabel.classList.add(model.cameraSide > 0 ? 'right' : 'left');
                }

                if (elementHighlight) {
                    const hightlightPosition = model.highlightPosition;
                    elementHighlight.style.display = 'block';
                    elementHighlight.style.transform = `translate(${ hightlightPosition.x }px, ${ hightlightPosition.y }px)`;
                    elementHighlight.classList.add(model.cameraSide > 0 ? 'right' : 'left');
                }

                if (!Breakpoints.active('small')) {
                    if (elementButton) {
                        const buttonPosition = model.buttonPosition;
                        elementButton.style.display = 'block';
                        elementButton.style.transform = `translate(${ buttonPosition.x }px, ${ buttonPosition.y }px)`;
                        elementButton.classList.add(model.cameraSide > 0 ? 'right' : 'left');
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
            itemsLabelRef.current = {};
            itemsHighlightRef.current = {};
            itemsButtonRef.current = {};
        };
    }, [entities]);

    return (
        <ul>
            {
                entities.map((entity, index) => {
                    return (
                        <li key={ index }>
                            <div className="label" ref={ el => itemsLabelRef.current[entity.slug] = el }>
                                <span>{ entity.name }</span>
                            </div>
                            <button className="button" ref={ el => itemsButtonRef.current[entity.slug] = el }>
                                <div className="button__content">
                                    <div className="button__icon"></div>
                                    <span className='button__label'><Trans>Click to discover</Trans></span>
                                </div>
                            </button>
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
