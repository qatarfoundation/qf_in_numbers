// Class
import TreeView from '@/webgl/views/tree/TreeView';

export default {
    name: 'Tree',
    slug: 'tree',
    class: TreeView,
    renderer: {
    },
    postProcessing: {
    },
    resources: {
        preload: {
            development: false,
            production: false,
        },
        items: [
            {
                type: 'texture',
                name: 'view/tree/particles-color-gradient',
                path: '/webgl/views/tree/particles-color-gradient.png',
            },
            {
                type: 'gltf',
                name: 'view/tree/tree',
                path: '/webgl/views/tree/tree.glb',
            },
        ],
    },
};
