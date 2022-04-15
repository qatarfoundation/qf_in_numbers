// Vendor
import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// CSS
import './style.scoped.scss';

function ButtonMainCategory(props) {
    const linkRef = useRef();

    useEffect(() => {
        const handler = (position) => {
            linkRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
        };

        TreeDataModel.addEventListener(`category/${props.index}/label/position`, handler);

        return () => {
            TreeDataModel.removeEventListener(`category/${props.index}/label/position`, handler);
        };
    }, [linkRef]);

    return (
        <Link className="button" to={ props.to } ref={ linkRef }>
            { props.label }
        </Link>
    );
}

export default ButtonMainCategory;
