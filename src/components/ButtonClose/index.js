// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

function ButtonClose(props, ref) {
    return (
        props.to ?
            <Link { ...props } className="button button-close">
                <span className="line line-left" />
                <span className="line line-right" />
            </Link>
            :
            <button { ...props } className="button button-close">
                <span className="line line-left" />
                <span className="line line-right" />
            </button>
    );
}

export default ButtonClose;
