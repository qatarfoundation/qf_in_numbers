// Vendor
import { gsap } from 'gsap';

// React
import { useEffect } from 'react';

// Hooks
import useStore from '@/hooks/useStore';

function useScrollList(category) {
    /**
     * Store
     */
    const [indexActiveSubcategory] = useStore((state) => [
        state.indexActiveSubcategory,
    ]);

    let isAnimating = false;

    useEffect(() => {
        const scrollList = [];

        const animationDelay = 1;
        let delayedCall = null;

        const entities = category.subcategories[indexActiveSubcategory].entities;

        entities.forEach((entity, index) => {
            scrollList.push({
                type: 'entity',
                index,
                name: entity.name,
                data: entity,
            });
        });

        function goto(index) {
            const currentScrollItem = scrollList[index];

            if (index > scrollList.length - 1) {
                const newIndexActiveSubcategory = indexActiveSubcategory + 1;
                const lengthSubcategories = category.subcategories.length - 1;
                if (newIndexActiveSubcategory <= lengthSubcategories) {
                    useStore.setState({ indexActiveEntity: 0 });
                    useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });
                }
            } else if (index < 0) {
                const newIndexActiveSubcategory = indexActiveSubcategory - 1;
                if (newIndexActiveSubcategory >= 0) {
                    useStore.setState({ indexActiveSubcategory: newIndexActiveSubcategory });
                    useStore.setState({ indexActiveEntity: category.subcategories[newIndexActiveSubcategory].entities.length - 1 });
                }
            } else {
                useStore.setState({ indexActiveEntity: currentScrollItem.index });
            }

            delayedCall?.kill();
            delayedCall = gsap.delayedCall(animationDelay, () => {
                isAnimating = false;
            });
        }

        function gotoNextScrollItem() {
            if (isAnimating) return;
            isAnimating = true;

            const indexActiveEntity = useStore.getState().indexActiveEntity;

            goto(indexActiveEntity + 1);
        }

        function gotoPreviousScrollItem() {
            if (isAnimating) return;
            isAnimating = true;

            const indexActiveEntity = useStore.getState().indexActiveEntity;

            goto(indexActiveEntity - 1);
        }

        function handler(e) {
            if (useStore.getState().modalYearIsOpen || useStore.getState().modalSearchIsOpen || useStore.getState().modalSubcategoriesIsOpen) return;

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
    }, [indexActiveSubcategory]);
}

export default useScrollList;
