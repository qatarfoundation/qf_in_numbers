// React
import { gsap } from 'gsap';
import React, { useRef, useEffect } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';

function LabelsEntities(props) {
    const { entities } = props;

    const itemsRef = useRef({});

    useEffect(() => {
        const handler = () => {
            for (const key in itemsRef.current) {
                const element = itemsRef.current[key];
                const model = TreeDataModel.getEntity(key);
                const labelPosition = model.labelPosition;
                if (element) {
                    element.style.display = 'block';
                    element.style.transform = `translate(${ labelPosition.x }px, ${ labelPosition.y }px)`;
                    element.className = model.cameraSide > 0 ? 'right' : 'left';
                }
            }
        };

        gsap.ticker.add(handler);

        return () => {
            gsap.ticker.remove(handler);
            for (const key in itemsRef.current) {
                const element = itemsRef.current[key];
                if (element) {
                    element.style.display = 'none';
                }
            }
            itemsRef.current = {};
        };
    }, [entities]);

    return (
        <ul>
            {
                entities.map((entity, index) => {
                    return (
                        <li key={ index } ref={ el => itemsRef.current[entity.slug] = el } className="right">
                            <span>{ entity.name }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default LabelsEntities;
