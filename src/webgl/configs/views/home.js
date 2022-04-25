// Vendor
import { Color, Euler, Vector3 } from 'three';

// Class
import HomeView from '@/webgl/views/home/HomeView';

export default {
    name: 'Home',
    slug: 'home',
    class: HomeView,
    renderer: {
        clearColor: 0x000000,
    },
    postProcessing: {
    },
    resources: {
        preload: {
            development: true,
            production: true,
        },
        items: [
            {
                type: 'texture',
                name: 'view/home/particles-color-gradient',
                path: '/webgl/views/home/particles-color-gradient.png',
            },
            {
                type: 'gltf',
                name: 'view/home/tree',
                path: '/webgl/views/home/tree.glb',
            },
        ],
    },
    backgroundGradients: {
        small: [
        ],
        large: [
            {
                'color': '#6eceb2',
                'alpha': 0.11029259182402988,
                'size': 0.5,
                'scale': {
                    'x': 288,
                    'y': 204,
                    'z': 1,
                },
                'position': {
                    'x': 0,
                    'y': 14,
                    'z': -18,
                },
            },
        ],
    },
    branches: [
        {
            name: 'Community',
            slug: 'community',
            position: new Vector3(),
            rotation: new Euler(0, -1.04, 0.52),
            meshRotation: new Euler(0, 0.19, 0),
            hoverColor: new Color(0x00BCE7),
            hoverBackgroundColor: new Color(0x051514),
            anchorPosition: new Vector3(-1, 7, 0),
            camera: {
                radiusOffset: 12,
                angleOffset: -1.65,
            },
        },
        {
            name: 'Research',
            slug: 'research',
            position: new Vector3(),
            rotation: new Euler(0, 3.17, 0.31),
            meshRotation: new Euler(0, -2.00, 0),
            hoverColor: new Color(0xFF671F),
            hoverBackgroundColor: new Color(0x1e050c),
            anchorPosition: new Vector3(0, 9, 0),
            camera: {
                radiusOffset: 20,
                angleOffset: -2,
            },
        },
        {
            name: 'Education',
            slug: 'education',
            position: new Vector3(),
            rotation: new Euler(0, 0.78, 0.55),
            meshRotation: new Euler(0, 0.20, 0),
            hoverColor: new Color(0x034638),
            hoverBackgroundColor: new Color(0x131414),
            anchorPosition: new Vector3(-1, 7, 0),
            camera: {
                radiusOffset: 21,
                angleOffset: -1.25,
            },
        },
    ],
};
