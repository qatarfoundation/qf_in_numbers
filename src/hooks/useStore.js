import create from 'zustand';

const useStore = create((set) => {
    return {
        modalYearIsOpen: false,
        modalSearchIsOpen: false,
        currentYear: '2021',
        filterType: 'entities',
        scrolls: [],
        iScroll: 0,
        selectedEntity: null,
        currentSubcategory: {},
    };
});

export default useStore;
