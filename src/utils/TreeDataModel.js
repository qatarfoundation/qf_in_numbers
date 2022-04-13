// Utils
import EventDispatcher from '@/utils/EventDispatcher';

// Model
const MODEL = {
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
    }

    /**
     * Public
     */
    updateCategoryLabelPosition(index, position) {
        MODEL.categories[index].label.position = position;
        this.dispatchEvent(`category/${index}/label/position`, position);
    }

    /**
     * Private
     */
}

export default new TreeDataModel();
