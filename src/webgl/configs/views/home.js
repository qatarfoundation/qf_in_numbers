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
    branches: [
        {
            name: 'Community',
            slug: 'community',
            position: new Vector3(),
            rotation: new Euler(0, -1.04, 0.52),
            meshRotation: new Euler(0, 0.19, 0),
            backgroundColor: new Color(0x53565A),
            anchorPosition: new Vector3(-1, 7, 0),
            subcategoriesAnchorPosition: new Vector3(0.5, 11, 0),
            particleColors: {
                primary: new Color(0x00bce7),
                secondary: new Color(0x53565a),
            },
            camera: {
                radiusOffset: 8, // 12,
                angleOffset: -1.65, //-1.65,
            },
        },
        {
            name: 'Research',
            slug: 'research',
            position: new Vector3(),
            rotation: new Euler(0, 3.17, 0.31),
            meshRotation: new Euler(0, -2.00, 0),
            backgroundColor: new Color(0x8A1538),
            anchorPosition: new Vector3(0, 9, 0),
            subcategoriesAnchorPosition: new Vector3(0, 12, 0.5),
            particleColors: {
                primary: new Color(0xff671f),
                secondary: new Color(0x8a1538),
            },
            camera: {
                radiusOffset: 15,
                angleOffset: -2,
            },
        },
        {
            name: 'Education',
            slug: 'education',
            position: new Vector3(),
            rotation: new Euler(0, 0.78, 0.55),
            meshRotation: new Euler(0, 0.20, 0),
            backgroundColor: new Color(0x154B48),
            anchorPosition: new Vector3(-1, 7, 0),
            subcategoriesAnchorPosition: new Vector3(0.4, 11, 0),
            particleColors: {
                primary: new Color(0x6eceb2),
                secondary: new Color(0x034638),
            },
            camera: {
                radiusOffset: 15,
                angleOffset: -1.25,
            },
        },
    ],
};
