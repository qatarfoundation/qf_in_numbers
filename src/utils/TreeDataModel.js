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
    entities: {},
    chartParticles: [],
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

    get chartParticles() {
        return this._model.chartParticles;
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
            if (item.slug === name) return item;
        }
    }

    addBranchesData(data) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const branch = this.getBranch(item.id);
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

    addEntity(id) {
        this._model.entities[id] = {
            labelPosition: {},
        };
    }

    getEntity(id) {
        return this._model.entities[id];
    }

    updateEntityLabelPosition(id, position, cameraSide) {
        this._model.entities[id].labelPosition = position;
        this._model.entities[id].cameraSide = cameraSide;
    }

    updateEntityButtonPosition(id, position) {
        this._model.entities[id].buttonPosition = position;
    }

    updateEntityHighlightPosition(id, position) {
        this._model.entities[id].highlightPosition = position;
    }

    empty() {
        this._model = JSON.parse(JSON.stringify(MODEL));
        this._isEmpty = true;
    }

    setSubcategory(name) {
        this._model.subcategory.active = name;
        this.dispatchEvent('subcategory/active', name);
    }

    updateChartParticlePosition(index, position) {
        this._model.chartParticles[index] = position;
    }
}

export default new TreeDataModel();
