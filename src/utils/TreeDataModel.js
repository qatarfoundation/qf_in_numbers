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
        },
        {
            label: {
                position: null,
            },
        },
        {
            label: {
                position: null,
            },
        },
    ],
};

class TreeDataModel extends EventDispatcher {
    constructor() {
        super();

        this._model = undefined;
        this.empty();
    }

    /**
     * Getters & Setters
     */
    get branches() {
        return this._model.branches;
    }

    /**
     * Public
     */
    addBranches(data) {
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
        data.forEach((item) => {
            const branch = this.getBranch(item.name);
            branch.data = item;
        });
        this.dispatchEvent('branches/add', this._model.branches);
    }

    updateCategoryLabelPosition(index, position) {
        this._model.categories[index].label.position = position;
        this.dispatchEvent(`category/${ index }/label/position`, position);
    }

    empty() {
        this._model = JSON.parse(JSON.stringify(MODEL));
    }
}

export default new TreeDataModel();
