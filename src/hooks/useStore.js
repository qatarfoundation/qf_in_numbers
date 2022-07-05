import create from 'zustand';

const useStore = create((set) => {
    return {
        modalEntityIsOpen: false,
        modalSubcategoriesIsOpen: false,
        currentYear: '2021',
        scrolls: [],
        iScroll: 0,
        selectedEntity: null,
        currentCategory: {},
        currentSubcategory: {},
        allEntities: [],
        allTags: [],
        isTutorial: false,
        themeCategory: 'theme-default',
        locale: null,
        indexActiveSubcategory: 0,
        indexActiveEntity: 0,
    };
});

export default useStore;
