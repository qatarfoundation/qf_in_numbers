import create from 'zustand';

const useStore = create((set) => {
    return {
        currentYear: '2021',
        selectedEntity: null,
        currentCategory: {},
        // Scroll
        scrolls: [],
        iScroll: 0,
        // Global
        locale: null,
        themeCategory: 'theme-default',
        isModalSubcategoriesOpen: false,
        isModalYearOpen: false,
        isModalSearchOpen: false,
        isCategorySelected: false,
    };
});

export default useStore;
