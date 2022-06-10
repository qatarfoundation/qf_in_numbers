// React
import React, { useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
// Components
import Drag from '@/assets/icons/drag.svg';
import Select from '@/assets/icons/select.svg';

// CSS
import './style.scoped.scss';

function Tutorial(props) {
    /**
     * States
     */
    const [isDrag, setIsDrag] = useState(true);
    const [isSelect, setIsSelect] = useState(false);
    const { navigate } = useI18next();
    /**
     * Private
     */
    function dragHandlerButtonDrag() {
        setIsDrag(false);
        setIsSelect(true);
    }

    function clickHandlerButtonSelect() {
        navigate(getLastYear());
    }
    function getLastYear() {
        const years = props.years;
        years.sort((a, b) => b.node.year - a.node.year);
        return years[0].node.year;
    }
    return (
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
    );
}

export default Tutorial;
