// Vendor
import { gsap } from 'gsap';

// React
import { useEffect } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

// Hooks
import useStore from '@/hooks/useStore';

// Utils
import Globals from '@/utils/Globals';

function useScrollList(category, subcategory) {
    const { navigate } = useI18next();

    useEffect(() => {
        const scrollList = [];
        let currentScrollIndex = -1;
        let isAnimating = false;
        const animationDelay = 1;
        let delayedCall = null;

        category.subcategories.forEach((subcategory) => {
            scrollList.push({
                type: 'subcategory',
                slug: subcategory.slug,
                data: subcategory,
            });
            subcategory.entities.forEach((entity) => {
                scrollList.push({
                    type: 'entity',
                    name: entity.name,
                    data: entity,
                });
            });
        });

        scrollList.forEach((item, index) => {
            if (item.data === subcategory)  {
                currentScrollIndex = index;
            }
        });

        function goto(index) {
            const currentScrollItem = scrollList[index];
            if (!currentScrollItem) return;

            if (currentScrollItem.type === 'subcategory') {
                navigate(currentScrollItem.slug);
            } else if (currentScrollItem.type === 'entity') {
                Globals.webglApp.gotoEntity(category.slug, currentScrollItem.data.slug);
                useStore.setState({ selectedEntity: currentScrollItem.data });
            }

            delayedCall?.kill();
            delayedCall = gsap.delayedCall(animationDelay, () => {
                isAnimating = false;
            });
        }

        function gotoNextScrollItem() {
            if (isAnimating) return;
            isAnimating = true;

            if (currentScrollIndex < scrollList.length - 1) {
                currentScrollIndex++;
            }
            goto(currentScrollIndex);
        }

        function gotoPreviousScrollItem() {
            if (isAnimating) return;
            isAnimating = true;

            if (currentScrollIndex > 0) {
                currentScrollIndex--;
            }
            goto(currentScrollIndex);
        }

        function handler(e) {
            if (e.deltaY > 0) {
                gotoNextScrollItem();
            } else {
                gotoPreviousScrollItem();
            }
        }

        window.addEventListener('mousewheel', handler);

        return () => {
            window.removeEventListener('mousewheel', handler);
            delayedCall?.kill();
        };
    }, []);
}

export default useScrollList;
