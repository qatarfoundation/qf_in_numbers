// Vendor
import { component } from '@/utils/bidello';

// Three
import { RGBAFormat, WebGLRenderTarget, LinearFilter } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Utils
import Debugger from '@/utils/Debugger';

// Passes
import FinalPass from '@/webgl/passes/Final';

// Shaders
import BackgroundGradientPass from '@/webgl/passes/BackgroundGradient';

// Hooks
import useStore from '@/hooks/useStore';

export default class Composer extends component() {
    init(options = {}) {
        // Data
        this._scenes = {};

        // Setup
        this._debug = this._createDebug();
        this._renderTarget = this._createRenderTarget();
        this._composer = this._createComposer(this._renderTarget, true);
        this._passes = this._createPasses();
    }

    destroy() {
        super.destroy();
        this._removeDebug();
    }

    /**
     * Getters & Setters
     */
    get passes() {
        return this._passes;
    }

    /**
     * Public
     */
    render(view) {
        this._passes.viewRender.scene = view.scene;
        this._passes.viewRender.camera = view.camera;

        this._passes.entityRender.scene = view.components.entity._scene;
        this._passes.entityRender.camera = view.components.entity._camera;

        this._composer.render();
    }

    addSettings(name, settings) {
        this._scenes[name] = settings;
    }

    loadSettings(name) {
        const settings = this._scenes[name];
        this._activeScene = settings;
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new WebGLRenderTarget(0, 0);
        renderTarget.texture.format = RGBAFormat;
        renderTarget.texture.minFilter = LinearFilter;
        renderTarget.texture.magFilter = LinearFilter;
        renderTarget.texture.generateMipmaps = false;
        renderTarget.texture.depthBuffer = false;
        return renderTarget;
    }

    _createComposer(renderTarget, renderToScreen) {
        const composer = new EffectComposer(this.$renderer, renderTarget);
        composer.renderToScreen = renderToScreen;
        return composer;
    }

    /**
     * Passes
     */
    _createPasses() {
        const passes = {};
        passes.backgroundGradient = this._createBackgroundGradientPass();
        passes.viewRender = this._createViewRenderPass();
        passes.entityRender = this._createEntityRenderPass();
        passes.final = this._createFinalPass();
        return passes;
    }

    _createBackgroundGradientPass() {
        const pass = new BackgroundGradientPass({
            debug: this._debug,
        });
        this._composer.addPass(pass);
        return pass;
    }

    _createViewRenderPass() {
        const pass = new RenderPass(null, null);
        pass.clear = false;
        this._composer.addPass(pass);
        return pass;
    }

    _createEntityRenderPass() {
        const pass = new RenderPass(null, null);
        pass.clear = false;
        this._composer.addPass(pass);
        return pass;
    }

    _createFinalPass() {
        const locale = useStore.getState().locale;
        const vignetteDirection = locale === 'ar-QA' ? -1 : 1;

        const pass = new FinalPass({
            vignette: {
                offset: 0.37,
                darkness: 0.31,
                direction: vignetteDirection,
            },
        });
        this._composer.addPass(pass);

        if (this._debug) {
            const debug = this._debug.addGroup('Final');
            debug.add(pass, 'enabled');

            const debugVignette = debug.addGroup('Vignette');
            debugVignette.add(pass, 'vignetteOffset', { label: 'offset', min: 0, max: 1 });
            debugVignette.add(pass, 'vignetteDarkness', { label: 'darkness', min: 0, max: 1 });
        }

        return pass;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeComposers(dimensions);
    }

    _resizeComposers({ renderWidth, renderHeight, dpr }) {
        this._composer.setSize(renderWidth * dpr, renderHeight * dpr);
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger) return;

        const debug = Debugger.addGroup('Global composer', {
            container: 'Global',
        });

        return debug;
    }

    _removeDebug() {
        if (this._debug) this._debug.remove();
    }
}
