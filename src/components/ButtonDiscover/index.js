// React
import React from 'react';
import { useTranslation, Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import Arrow from '@/assets/icons/arrow.svg';

function ButtonPagination(props) {
    /**
     * Datas
     */
    const { name, slug } = props;
    const { t } = useTranslation();

    return (
        <Link to={ slug ? slug : '' } { ...props } className={ `button button-discover ${ props.direction }` }>
            <div className="icon icon-arrow">
                <Arrow className={ `arrow ${ props.direction }` } />
            </div>
            <p>{ `${ t('Tap to explore') }${ name ? ` <br />${ name }` : '' }` }</p>
        </Link>
    );
}

export default ButtonPagination;
