// React
import React from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ListItemYear from '@/components/ListItemYear';

function ListYears(props, ref) {
    /**
     * Data
     */
    const { years } = props;
    const { i18n } = useTranslation();

    return (
        <ul className="list-years">
            { years.map(function(object, i) {
                if (object.node.node_locale === i18n.language) {
                    return <ListItemYear
                        key={ i }
                        year={ object.node.year }
                    />;
                }
            }) }
        </ul>
    );
}

export default ListYears;
