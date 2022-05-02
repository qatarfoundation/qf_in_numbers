// Vendor
import React, { useEffect, useRef } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';

const LabelMainCategory = (props) => {
    const labelRef = useRef();

    useEffect(() => {
        const handler = (position) => {
            labelRef.current.style.transform = `translate(${ position.x }px, ${ position.y }px)`;
        };

        TreeDataModel.addEventListener(`category/${ props.index }/label/position`, handler);

        return () => {
            TreeDataModel.removeEventListener(`category/${ props.index }/label/position`, handler);
        };
    }, [labelRef]);

    return (
        <div className={ `label ${ props.anchor }` } ref={ labelRef }>
            <div className="copy">
                { props.label }
            </div>
        </div>
    );
};

export default LabelMainCategory;
