import create from 'zustand';

const useStore = create((set) => {
    return {
        currentYear: '2021',
        selectedEntity: null,
        currentCategory: {},
        currentSubcategory: {},
        indexActiveSubcategory: 0,
        indexActiveEntity: 0,
        // Scroll
        scrolls: [],
        iScroll: 0,
        //
        locale: null,
        themeCategory: 'theme-default',
    };
});

export default useStore;
