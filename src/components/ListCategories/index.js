// React
import React, { useEffect } from 'react';

// CSS
import './style.scoped.scss';

// Components
import ButtonMainCategory from '@/components/ButtonMainCategory';

function ListCategories(props) {
    const { categories } = props;

    return (
        <ul className="list-categories">

            { categories[0] &&
                <li className="list-item">
                    <ButtonMainCategory index={ 0 } label={ categories[0].name } color="blue" anchorX="left" anchorY="top" />
                </li>
            }

            { categories[1] &&
                <li className="list-item">
                    <ButtonMainCategory index={ 1 } label={ categories[1].name } color="red" anchorX="left" anchorY="top" />
                </li>
            }

            { categories[2] &&
                <li className="list-item">
                    <ButtonMainCategory index={ 2 } label={ categories[2].name } color="green" anchorX="right" anchorY="top" />
                </li>
            }

        </ul>
    );
}

export default ListCategories;
