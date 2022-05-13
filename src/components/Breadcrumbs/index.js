// React
import React from 'react';
import { Link } from 'gatsby-plugin-react-i18next';

// CSS
import './style.scoped.scss';

// Hooks
import useStore from '@/hooks/useStore';

function Breakcrumbs(props) {
    const currentYear = useStore((state) => state.currentYear);
    const currentCategory = useStore((state) => state.currentCategory);
    const currentSubcategory = useStore((state) => state.currentSubcategory);

    return (
        <ul>
            { currentYear &&
                <li>
                    <Link to={ '/' + currentYear }>{ currentYear }</Link> &gt;
                </li>
            }

            { currentCategory &&
                <li>
                    <Link to={ currentCategory.slug }>{ currentCategory.name }</Link> &gt;
                </li>
            }

            { currentSubcategory &&
                <li>
                    <Link to={ currentSubcategory.slug }>{ currentSubcategory.name }</Link>
                </li>
            }
        </ul>
    );
}

export default Breakcrumbs;
