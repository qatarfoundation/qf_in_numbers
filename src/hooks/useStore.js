import create from 'zustand';

const useStore = create((set) => {
    return {
        currentYear: '2021',
        scrolls: [],
        iScroll: 0,
        selectedEntity: null,
        currentCategory: {},
        currentSubcategory: {},
        themeCategory: 'theme-default',
        locale: null,
        indexActiveSubcategory: 0,
        indexActiveEntity: 0,
    };
});

export default useStore;
