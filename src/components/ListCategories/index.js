// React
import React, { useEffect } from 'react';

// CSS
import './style.scoped.scss';

// Components
import LabelMainCategory from '@/components/LabelMainCategory';

function ListCategories(props) {
    const { categories } = props;

    return (
        <ul className="list-categories">

            { categories[0] &&
                <li className="list-item">
                    <LabelMainCategory index={ 0 } label={ categories[0].name } anchor="left" />
                </li>
            }

            { categories[1] &&
                <li className="list-item">
                    <LabelMainCategory index={ 1 } label={ categories[1].name } anchor="left" />
                </li>
            }

            { categories[2] &&
                <li className="list-item">
                    <LabelMainCategory index={ 2 } label={ categories[2].name } anchor="right" />
                </li>
            }

        </ul>
    );
}

export default ListCategories;
