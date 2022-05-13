// Vendor
import { gsap } from 'gsap';

// React
import React, { useRef, useEffect, useState } from 'react';
import { usePresence } from 'framer-motion';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Hooks
import usePopulateTreeDataModel from '@/hooks/usePopulateTreeDataModel';

// CSS
import './style.scoped.scss';

// Hooks
import useTemplateData from '@/hooks/useTemplateData';
import useStore from '@/hooks/useStore';

// Utils
import Globals from '@/utils/Globals';
import TreeDataModel from '@/utils/TreeDataModel';

// Components
import ListSubcategories from '@/components/ListSubcategories';
import LabelsEntities from '@/components/LabelsEntities';

function CategoryTemplate(props) {
    /**
     * Data
     */
    const { language } = props.pageContext;

    /**
     * States
     */
    const [entities, setEntities] = useState([]);
    const [isPresent, safeToRemove] = usePresence();
    const { navigate } = useI18next();

    /**
     * Store
     */
    const enitity = useStore((state) => state.selectedEntity);

    /**
     * Hooks
     */
    const data = useTemplateData(props.pageContext, language);
    const year = data.year[language];
    const category = data.category[language];
    const subcategory = data.subcategory ? data.subcategory[language] : null;
    usePopulateTreeDataModel(year.year, year.categories);

    useEffect(() => {
        if (isPresent) transitionIn();
        else if (!isPresent) transitionOut(safeToRemove);
    }, [isPresent]);

    useEffect(() => {
        useStore.setState({ currentCategory: category });
        useStore.setState({ currentSubcategory: subcategory });

        const slug = category.slug.split('/').slice(-1)[0];
        if (subcategory) {
            Globals.webglApp.gotoSubcategory(slug, subcategory.name);
        } else {
            Globals.webglApp.gotoCategory(slug);
        }
    }, []);

    useEffect(() => {
        if (subcategory) setEntities(subcategory.entities);

        const handler = (name) => {
            const subcategories = category.subcategories;
            const subcategory = subcategories.filter(subcategory => subcategory.name === name)[0];
            if (subcategory) setEntities(subcategory.entities);
        };

        TreeDataModel.addEventListener('subcategory/active', handler);

        return () => {
            TreeDataModel.addEventListener('subcategory/active', handler);
        };
    }, []);

    /**
     * Refs
     */
    const el = useRef();

    /**
     * Private
     */
    function transitionIn() {
        return gsap.to(el.current, { duration: 0.5, alpha: 1, ease: 'sine.inOut', onComplete: transitionInCompleted });
    }

    function transitionOut() {
        return gsap.to(el.current, { duration: 0.5, alpha: 0, ease: 'sine.inOut', onComplete: transitionOutCompleted });
    }

    function transitionInCompleted() {
        //
    }

    function transitionOutCompleted() {
        // Unmount
        safeToRemove();
    }

    function buttonDiscoverClickHandler() {
        const { slug, name } = enitity;
        navigate(slug);
        // Globals.webglApp.selectEntity(category.name, name);
    }

    return (
        <div className="template-category" ref={ el }>

            <div className="container-page container">

                <ListSubcategories categorySlug={ category.slug } subcategories={ category.subcategories } />

                { enitity &&
                    <>
                        { /* <LabelsEntities entities={ entities } /> */ }
                        <button className="button button-discover" onClick={ buttonDiscoverClickHandler }>Click to discover</button>
                    </>
                }

            </div>

        </div>
    );
}

export default CategoryTemplate;

export const query = graphql`
    query ($language: String!) {
        locales: allLocale(filter: {language: {eq: $language}}) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
    }
`;

// useEffect(() => {
//     const scrollList = [];
//     let currentScrollIndex = -1;
//     let isAnimating = false;
//     const animationDelay = 1;
//     let delayedCall = null;

//     console.log('useEffect');

//     category.subcategories.forEach((subcategory) => {
//         scrollList.push({
//             type: 'subcategory',
//             slug: subcategory.slug,
//             data: subcategory,
//         });
//         subcategory.entities.forEach((entity) => {
//             scrollList.push({
//                 type: 'entity',
//                 name: entity.name,
//                 data: entity,
//             });
//         });
//     });

//     scrollList.forEach((item, index) => {
//         if (item.data === subcategory)  {
//             currentScrollIndex = index;
//         }
//     });

//     function goto(index) {
//         const currentScrollItem = scrollList[index];
//         if (!currentScrollItem) return;

//         console.log(index);
//         console.log(currentScrollItem);

//         if (currentScrollItem.type === 'subcategory') {
//             navigate(currentScrollItem.slug);
//         } else if (currentScrollItem.type === 'entity') {
//             Globals.webglApp.gotoEntity(category.name, currentScrollItem.name);
//             useStore.setState({ selectedEntity: currentScrollItem.data });
//         }

//         delayedCall?.kill();
//         delayedCall = gsap.delayedCall(animationDelay, () => {
//             isAnimating = false;
//         });
//     }

//     function gotoNextScrollItem() {
//         if (isAnimating) return;
//         isAnimating = true;

//         if (currentScrollIndex < scrollList.length - 1) {
//             currentScrollIndex++;
//         }
//         goto(currentScrollIndex);
//     }

//     function gotoPreviousScrollItem() {
//         if (isAnimating) return;
//         isAnimating = true;

//         if (currentScrollIndex > 0) {
//             currentScrollIndex--;
//         }
//         goto(currentScrollIndex);
//     }

//     function handler(e) {
//         if (e.deltaY > 0) {
//             gotoNextScrollItem();
//         } else {
//             gotoPreviousScrollItem();
//         }
//     }

//     window.addEventListener('mousewheel', handler);

//     return () => {
//         window.removeEventListener('mousewheel', handler);
//         delayedCall?.kill();
//     };
// }, []);
