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
    const { years, currentYear } = props;

    return (
        <ul className="list-years">

            { years.map((item, i) => <ListItemYear key={ i } year={ item } active={ item.year === currentYear.year } />) }

        </ul>
    );
}

export default ListYears;
