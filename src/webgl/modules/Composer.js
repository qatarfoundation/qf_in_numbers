// Vendor
import { component } from '@/utils/bidello';

// Three
import { RGBAFormat, WebGLRenderTarget, LinearFilter } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Utils
import Debugger from '@/utils/Debugger';

// Shaders
import BackgroundGradientPass from '@/webgl/passes/BackgroundGradient';
import FinalPass from '@/webgl/passes/Final';

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
        passes.final = this._createFinalPass();
        return passes;
    }

    /**
     * Passes
     */
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

    _createFinalPass() {
        const pass = new FinalPass();
        this._composer.addPass(pass);
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
