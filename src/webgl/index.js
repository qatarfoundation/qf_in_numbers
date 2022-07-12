// Vendor
import { gsap } from 'gsap';
import bidello from '@/utils/bidello';
import { ACESFilmicToneMapping, CineonToneMapping, Clock, Color, LinearToneMapping, NoToneMapping, ReinhardToneMapping, WebGLRenderer } from 'three';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel';
import Stats from 'stats-js';

// Utils
import Debugger from '@/utils/Debugger';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

// Bidello helpers
import BidelloMouseHelper from '@/webgl/helpers/bidello/Mouse';

// Modules
import ViewManager from '@/webgl/modules/ViewManager';
import Composer from '@/webgl/modules/Composer';

// API
import API from '@/webgl/api';

class Main {
    constructor(options = {}) {
        // Options
        this._canvas = options.canvas;
        this._showDebug = options.showDebug || false;
        this._mouseAreaElement = options.mouseAreaElement;

        // Props
        this._isInteractive = true;
        this._idleRotation = false;

        // Setup
        this._debug = this._createDebug();
        this._clock = this._createClock();
        this._renderer = this._createRenderer();
        this._composer = this._createComposer();

        if (this._showDebug) {
            // this._stats = this._createStats();
            // this._statsGpuPanel = this._createStatsGpuPanel();
        }

        this._bindHandlers();
        this._setupEventListeners();
        this._registerBidelloGlobals();
        BidelloMouseHelper.init({
            element: this._mouseAreaElement,
        });
    }

    destroy() {
        this._removeStats();
        this._removeEventListeners();
        this._viewManager?.destroy();
        this._composer.destroy();
        this._removeDebug();
        BidelloMouseHelper.destroy();
    }

    /**
     * Getters & Setters
     */
    get mouseAreaElement() {
        return this._mouseAreaElement;
    }

    get isInteractive() {
        return this._isInteractive;
    }

    get idleRotation() {
        return this._idleRotation;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._resizeHandler = this._resizeHandler.bind(this);
        this._tickHandler = this._tickHandler.bind(this);
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        gsap.ticker.add(this._tickHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        gsap.ticker.remove(this._tickHandler);
    }

    _registerBidelloGlobals() {
        bidello.registerGlobal('root', this);
    }

    _start() {
        this._viewManager = this._createViewManager();
        WindowResizeObserver.triggerResize();
    }

    _createStats() {
        const stats = new Stats();
        document.body.appendChild(stats.dom);
        return stats;
    }

    _createStatsGpuPanel() {
        const panel = new GPUStatsPanel(this._renderer.getContext());
        this._stats.addPanel(panel);
        this._stats.showPanel(0);
        return panel;
    }

    _removeStats() {
        if (!this._stats) return;
        document.body.removeChild(this._stats.dom);
        this._stats = null;
    }

    _createClock() {
        const clock = new Clock();
        return clock;
    }

    _createRenderer() {
        const renderer = new WebGLRenderer({
            antialias: false,
            canvas: this._canvas,
            powerPreference: 'high-performance',
            // preserveDrawingBuffer: true,
            // alpha: true,
        });

        const clearColor = new Color('#000000');
        renderer.setClearColor(clearColor, 1);
        // renderer.autoClear = false;
        renderer.toneMapping = LinearToneMapping;
        // renderer.outputEncoding = sRGBEncoding;
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = PCFSoftShadowMap;

        if (this._debug) {
            const toneMaps = {
                NoToneMapping,
                LinearToneMapping,
                ReinhardToneMapping,
                CineonToneMapping,
                ACESFilmicToneMapping,
            };
            this._debug.add(renderer, 'toneMapping', {
                options: toneMaps,
                onChange: () => {
                    const scene = this._viewManager.active;
                    renderer.compile(scene.scene, scene.camera);
                },
            });
            this._debug.add(renderer, 'toneMappingExposure', { min: 0, max: 10 });
        }

        // Register as global
        bidello.registerGlobal('renderer', renderer);

        return renderer;
    }

    _createComposer() {
        const composer = new Composer();
        bidello.registerGlobal('composer', composer);
        return composer;
    }

    _createViewManager() {
        const viewManager = new ViewManager();
        return viewManager;
    }

    /**
     * Update cycle
     */
    _tick() {
        this._stats?.begin();
        this._update();
        this._render();
        this._stats?.end();
    }

    _update() {
        this._triggerBidelloUpdate();
    }

    _triggerBidelloUpdate() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();

        bidello.trigger(
            {
                name: 'update',
                fireAtStart: false,
            },
            {
                delta,
                time,
            },
        );
    }

    _render() {
        const view = this._viewManager?.active;
        if (!view) return;

        this._statsGpuPanel?.startQuery();
        this._composer.render(view);
        this._statsGpuPanel?.endQuery();
    }

    /**
     * Resize
     */
    _resize(dimensions) {
        // Render scale
        dimensions.renderScale = 1;

        // Define render dimensions
        dimensions.renderWidth = dimensions.innerWidth;
        dimensions.renderHeight = dimensions.innerHeight;

        this._resizeCanvas(dimensions);
        this._resizeRenderer(dimensions);
        this._triggerBidelloResize(dimensions);
    }

    _resizeCanvas({ innerWidth, innerHeight }) {
        this._renderer.domElement.style.width = `${ innerWidth }px`;
        this._renderer.domElement.style.height = `${ innerHeight }px`;
    }

    _resizeRenderer({ renderWidth, renderHeight, dpr }) {
        this._renderer.setPixelRatio(dpr);
        this._renderer.setSize(renderWidth, renderHeight, false);
    }

    _triggerBidelloResize(dimensions) {
        bidello.trigger(
            {
                name: 'windowResize',
                fireAtStart: true,
            },
            {
                ...dimensions,
            },
        );
    }

    /**
     * Handlers
     */
    _resizeHandler(dimensions) {
        this._resize(dimensions);
    }

    _tickHandler() {
        this._tick();
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Renderer', { container: 'Global' });
        return debug;
    }

    _removeDebug() {
        if (this._debug) this._debug.remove();
    }
}

// Extend with API methods
Object.assign(Main.prototype, API);

export default Main;
