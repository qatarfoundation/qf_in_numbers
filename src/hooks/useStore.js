import create from 'zustand';

const useStore = create((set) => {
    return {
        modalYearIsOpen: false,
        modalSearchIsOpen: false,
        modalEntityIsOpen: false,
        currentYear: '2021',
        filterType: 'entities',
        scrolls: [],
        iScroll: 0,
        selectedEntity: null,
        currentCategory: {},
        currentSubcategory: {},
        allEntities: [],
        allTags: [],
        isTutorial: false,
        themeCategory: 'theme-default',
    };
});

export default useStore;
