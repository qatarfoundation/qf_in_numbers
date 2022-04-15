// React
import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Components
import ButtonHome from '@/components/ButtonHome';
import LangSwitch from '@/components/LangSwitch';
import ButtonSound from '@/components/ButtonSound';

function TheNavigation(props) {
    return (
        <div className="the-navigation">

            <div className="row">

                <div className="col-left">
                    <ButtonHome />
                </div>

                <div className="col-right">
                    <ButtonSound className="button-sound" />
                    <LangSwitch />
                </div>
            </div>

        </div>
    );
}

export default TheNavigation;
