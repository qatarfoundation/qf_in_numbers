// Class
import HomeView from '@/webgl/views/home/HomeView';

export default {
    name: 'Home',
    slug: 'home',
    class: HomeView,
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
