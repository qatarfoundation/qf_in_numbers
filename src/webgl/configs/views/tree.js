// Class
import TreeView from '@/webgl/views/tree/TreeView';

export default {
    name: 'Tree',
    slug: 'tree',
    class: TreeView,
    renderer: {
        clearColor: '#000000',
    },
    postProcessing: {
    },
    resources: {
        preload: {
            development: false,
            production: false,
        },
        items: [
        ],
    },
};
