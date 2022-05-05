import create from 'zustand';

const useStore = create((set) => {
    return {
        modalYearIsOpen: false,
        modalSearchIsOpen: false,
        currentYear: '2022',
        filterType: 'entities',
    };
});

export default useStore;
