// React
import React from 'react';

// CSS
import './style.scoped.scss';

// Components
import ListItemYear from '@/components/ListItemYear';

function ListYears(props, ref) {
    /**
     * Data
     */
    const { years } = props;

    return (
        <ul className="list-years">
            {
                years.map((item, index) => {
                    return <ListItemYear
                        key={ index }
                        year={ item }
                    />;
                })
            }
        </ul>
    );
}

export default ListYears;
