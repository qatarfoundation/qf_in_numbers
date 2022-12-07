// React
import React from 'react';

// CSS
import './style.scoped.scss';

function Highlights(props) {
    const { data = [] } = props;

    return (
        <ul className="highlights">
            {
                data.map(function(highlight, index) {
                    return (
                        <li key={ index }>
                            <span className="title">{ highlight.title }</span>
                            <span className="value">{ highlight.value }</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Highlights;
