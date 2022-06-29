// React
import React, { useEffect } from 'react';

// CSS
import './style.scoped.scss';

// Components
import LabelMainCategory from '@/components/LabelMainCategory';

function ListCategories(props) {
    const { categories, year } = props;

    const colors = ['blue', 'red', 'green'];

    return (
        <ul className="list-categories">

            { categories[0] &&
                <li className="list-item">
                    <LabelMainCategory index={ 0 } slug={ `/${ year }/community` } label={ categories[0].name } category="community" color={ colors[0] } anchor="left" />
                </li>
            }

            { categories[1] &&
                <li className="list-item">
                    <LabelMainCategory index={ 1 } slug={ `/${ year }/research` } label={ categories[1].name } category="research" color={ colors[1] } anchor="left" />
                </li>
            }

            { categories[2] &&
                <li className="list-item">
                    <LabelMainCategory index={ 2 } slug={ `/${ year }/education` } label={ categories[2].name } category="education" color={ colors[2] } anchor="right" />
                </li>
            }

        </ul>
    );
}

export default ListCategories;
