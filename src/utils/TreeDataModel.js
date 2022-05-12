// Utils
import EventDispatcher from '@/utils/EventDispatcher';

// Model
const MODEL = {
    branches: [],
    categories: [
        {
            label: {
                position: null,
            },
            categoriesAnchor: {
                position: null,
            },
        },
        {
            label: {
                position: null,
            },
            categoriesAnchor: {
                position: null,
            },
        },
        {
            label: {
                position: null,
            },
            categoriesAnchor: {
                position: null,
            },
        },
    ],
    subcategory: {
        active: null,
    },
};

class TreeDataModel extends EventDispatcher {
    constructor() {
        super();

        // Props
        this._model = undefined;
        this._isEmpty = true;

        // Setup
        this.empty();
    }

    /**
     * Getters & Setters
     */
    get branches() {
        return this._model.branches;
    }

    get isEmpty() {
        return this._isEmpty;
    }

    /**
     * Public
     */
    addBranches(data) {
        this._isEmpty = false;
        this._model.branches.push(...data);
    }

    getBranches() {
        return this._model.branches;
    }

    getBranch(name) {
        for (let i = 0, len = this._model.branches.length; i < len; i++) {
            const item = this._model.branches[i];
            if (item.name === name) return item;
        }
    }

    addBranchesData(data) {
        for (const key in data) {
            const item = data[key];
            const branch = this.getBranch(item.name);
            branch.data = item;
        }
        this.dispatchEvent('branches/add', this._model.branches);
    }

    updateCategoryLabelPosition(index, position) {
        this._model.categories[index].label.position = position;
        this.dispatchEvent(`category/${ index }/label/position`, position);
    }

    updateSubcategoriesAnchorPosition(index, position) {
        this._model.categories[index].categoriesAnchor.position = position;
        this.dispatchEvent(`category/${ index }/categoryAnchor/position`, position);
    }

    empty() {
        this._model = JSON.parse(JSON.stringify(MODEL));
        this._isEmpty = true;
    }

    setSubcategory(name) {
        this._model.subcategory.active = name;
        this.dispatchEvent('subcategory/active', name);
    }
}

export default new TreeDataModel();
