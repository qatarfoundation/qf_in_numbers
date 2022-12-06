import create from 'zustand';

const useStore = create((set) => {
    return {
        currentYear: '2021',
        selectedEntity: null,
        currentCategory: {},
        locale: null,
        themeCategory: 'theme-default',
        themeColors: { primary: null, secondary: null },
        isModalSubcategoriesOpen: false,
        isModalYearOpen: false,
        isModalSearchOpen: false,
        isCategorySelected: false,
        entityShowScrollIndicator: false,
        previousRoute: null,
    };
});

export default useStore;
