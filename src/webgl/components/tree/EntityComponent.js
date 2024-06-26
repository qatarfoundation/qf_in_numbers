// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { AdditiveBlending, BufferGeometry, CatmullRomCurve3, Color, InstancedBufferAttribute, InstancedMesh, Line, LineBasicMaterial, Object3D, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, Vector3 } from 'three';

// Hooks
import useStore from '@/hooks/useStore';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import randomArbitrary from '@/utils/math/randomArbitrary';
import Breakpoints from '@/utils/Breakpoints';
import math from '@/utils/math';
import Scrolls from '@/utils/Scrolls';

// Shaders
import vertexShader from '@/webgl/shaders/entity-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/entity-particles/fragment.glsl';

import particlesBigVertexShader from '@/webgl/shaders/tree-particles-big/vertex.glsl';
import particlesBigFragmentShader from '@/webgl/shaders/tree-particles-big/fragment.glsl';

export default class EntityComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._config = options.config;

        // Setup
        this._scrollHeight = 0;
        this._isTransitioning = false;
        this._scene = new Scene();
        this._scrollContainer = this._createScrollContainer();
        this._camera = this._createCamera();
        this._curve = this._createCurve();
        // this._skeleton = this._createSkeleton();
        this._particles = this._createParticles();
        this._particlesMat = null;

        this._halfRenderWidth = 0;
        this._halfRenderHeight = 0;

        this._chartParticlePositions = new Object3D();
        this._scrollContainer.add(this._chartParticlePositions);

        this._scrollPosition = {
            current: 0,
            target: 0,
        };

        this.visible = false;

        // // Settings
        // const geometry = new BoxBufferGeometry(10, 10, 10);
        // const material = new MeshBasicMaterial({ color: 0xff0000 });
        // const mesh = new Mesh(geometry, material);
        // this._scene.add(mesh);
    }

    destroy() {
        super.destroy();
        this._timelineShow?.kill();
        this._timelineHide?.kill();
    }

    /**
     * Public
     */
    show(data, category) {
        const colors = this._getColors(category);

        this._chartParticles = this._createChartParticles(data.charts, colors);
        this._updateParticlesColors(colors);

        this._timelineShow = new gsap.timeline();
        this._timelineShow.set(this, { visible: true });
        this._timelineShow.set(this._scrollPosition, { target: 0 });
        this._timelineShow.set(this._scrollPosition, { current: 0 });
        this._timelineShow.set(this._scrollContainer.position, { y: 0 });
        this._timelineShow.to(this._particles.material.uniforms.uOpacity, { duration: 1, value: 0.25, ease: 'sine.inOut' }, 0.1);
        this._timelineShow.to(this._chartParticles.material.uniforms.uOpacity, { duration: 1, value: 1, ease: 'sine.inOut' }, 0.2);
        this._timelineShow.set(this, { _isTransitioning: false }, 0.2);
        return this._timelineShow;
    }

    hide() {
        this._timelineHide = new gsap.timeline({
            onComplete: () => {
                this._destroyChartParticles();
            },
        });
        this._timelineHide.to(this._particles.material.uniforms.uOpacity, { duration: 0.5, value: 0, ease: 'sine.inOut' }, 0);
        if (this._chartParticles) this._timelineHide.to(this._chartParticles.material.uniforms.uOpacity, { duration: 0.5, value: 0, ease: 'sine.inOut' }, 0.1);
        this._timelineHide.set(this, { visible: false });
        this._timelineHide.set(this, { _isTransitioning: true });
        return this._timelineHide;
    }

    /**
     * Private
     */
    _createScrollContainer() {
        const container = new Object3D();
        this._scene.add(container);
        return container;
    }

    _createCamera() {
        const camera = new OrthographicCamera(0, 0, 0, 0, 0, 1000);
        camera.position.z = 5;
        return camera;
    }

    _createCurve() {
        const amount = 20;
        const points = [];

        for (let i = 0; i < amount; i++) {
            const x = randomArbitrary(-20, 20);
            const y = i * -150;
            const z = 0;
            const point = new Vector3(x, y, z);
            points.push(point);
        }

        const curve = new CatmullRomCurve3(points);
        return curve;
    }

    _createSkeleton() {
        const points = this._curve.getPoints(50);
        const material = new LineBasicMaterial({ color: 0x0000ff });
        const geometry = new BufferGeometry().setFromPoints(points);
        const skeleton = new Line(geometry, material);
        this._scrollContainer.add(skeleton);
        return skeleton;
    }

    _createParticles() {
        const amount = 150;
        const vertices = [];
        const sizes = [];
        const colors = [];
        const displacements = [];

        for (let i = 0; i < amount; i++) {
            const point = this._curve.getPointAt(Math.random());
            point.x += randomArbitrary(-80, 80);
            this._scrollHeight = this._scrollHeight > -point.y ? this._scrollHeight : -point.y;
            vertices.push(point.x, point.y, point.z);
            sizes.push(randomArbitrary(0.2, 1));
            colors.push(Math.random() > 0.5 ? 1 : 0);
            displacements.push(Math.random());
            displacements.push(Math.random());
        }

        const geometry = new PlaneBufferGeometry(1, 1);
        geometry.setAttribute('size', new InstancedBufferAttribute(new Float32Array(sizes), 1));
        geometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 1));
        geometry.setAttribute('displacement', new InstancedBufferAttribute(new Float32Array(displacements), 2));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColor1: { value: new Color() },
                uColor2: { value: new Color() },
                uPointSize: { value: 15 },
                uInnerGradient: { value: 0.1 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
                uTime: { value: 0 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new InstancedMesh(geometry, material, amount);
        this._scrollContainer.add(mesh);

        let x, y, z;
        const dummy = new Object3D();
        for (let i = 0, len = vertices.length; i < len; i += 3) {
            x = vertices[i + 0];
            y = vertices[i + 1];
            z = vertices[i + 2];
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            mesh.setMatrixAt(i / 3, dummy.matrix);
        }

        return mesh;
    }

    _getColors(category) {
        for (let i = 0, len = this._config.branches.length; i < len; i++) {
            const item = this._config.branches[i];
            if (item.slug === category) {
                return item.particleColors;
            }
        }
        return null;
    }

    _createChartParticles(charts, colors) {
        const chartsGrouped = this._groupCharts(charts);
        const positions = [];
        const sizes = [];
        const amount = Object.keys(chartsGrouped).length;

        for (let i = 0; i < amount; i++) {
            const point = this._curve.getPointAt(0.1 + i * .9 / amount);
            point.x += randomArbitrary(-80, 80);
            positions.push(point);

            sizes.push(randomArbitrary(0.8, 1));
        }

        const geometry = new PlaneBufferGeometry(1.0, 1.0);
        geometry.setAttribute('size', new InstancedBufferAttribute(new Float32Array(sizes), 1));

        const material = new ShaderMaterial({
            vertexShader: particlesBigVertexShader,
            fragmentShader: particlesBigFragmentShader,
            uniforms: {
                uColor: { value: colors.primary },
                uPointSize: { value: 90 },
                uInnerGradient: { value: 0.1 },
                uOuterGradient: { value: 0 },
                uOpacity: { value: 0 },
            },
            transparent: true,
            // blending: AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        const mesh = new InstancedMesh(geometry, material, amount);
        this._scrollContainer.add(mesh);

        const dummy = new Object3D();
        for (let i = 0, len = positions.length; i < len; i++) {
            const position = positions[i];
            dummy.position.copy(position);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);

            const anchor = new Object3D();
            anchor.position.copy(position);
            anchor.userData.transformed = new Vector3();
            anchor.userData.target = new Vector3();
            this._chartParticlePositions.add(anchor);
        }

        return mesh;
    }

    _destroyChartParticles() {
        if (!this._chartParticles) return;
        this._chartParticles.removeFromParent();
        this._chartParticles.material.dispose();
        this._chartParticles.geometry.dispose();
        this._chartParticles.dispose();
        this._chartParticlePositions.clear();
    }

    _updateParticlesColors(colors) {
        this._particles.material.uniforms.uColor1.value = colors.primary;
        this._particles.material.uniforms.uColor2.value = colors.secondary;
    }

    _groupCharts(charts) {
        const groups = {};
        if (charts) {
            for (let i = 0, len = charts.length; i < len; i++) {
                const item = charts[i];
                if (!groups[item.type]) {
                    groups[item.type] = [];
                }
                groups[item.type].push(item);
            }
        }
        return groups;
    }

    /**
     * Update
     */
    update({ time }) {
        this._updateScrollPosition();
        this._updateChartParticlesScreenSpacePositions();
        this._particles.material.uniforms.uTime.value = time;
    }

    _updateScrollPosition() {
        const scrollData = Scrolls['panel-entity'];
        if (scrollData && !this._isTransitioning) {
            // this._scrollPosition.target = scrollData.scrollY / (scrollData.scrollHeight - scrollData.innerHeight) * this._scrollHeight;
            this._scrollPosition.target = scrollData.scrollY;
            this._scrollPosition.current = math.lerp(this._scrollPosition.current, this._scrollPosition.target, 0.075);
            // this._scrollPosition.current = this._scrollPosition.target;
            this._scrollContainer.position.y = this._scrollPosition.current;
        }
    }

    _updateChartParticlesScreenSpacePositions() {
        let item;
        let transformed;
        let target;
        for (let i = 0, len = this._chartParticlePositions.children.length; i < len; i++) {
            item = this._chartParticlePositions.children[i];
            item.updateMatrix();
            item.updateMatrixWorld();
            transformed = item.userData.transformed;
            target = item.userData.target;
            transformed.setFromMatrixPosition(item.matrixWorld);
            transformed.project(this._camera);
            transformed.x = (transformed.x * this._halfRenderWidth) + this._halfRenderWidth;
            transformed.y = -(transformed.y * this._halfRenderHeight) + this._halfRenderHeight;

            // target.x = math.lerp(target.x, transformed.x, 0.1);
            // target.y = math.lerp(target.y, transformed.y, 0.1);
            TreeDataModel.updateChartParticlePosition(i, {
                position: transformed,
                side: transformed.x > this._sceneWidth * 0.5 ? 'right' : 'left',
            });
        }
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._halfRenderWidth = dimensions.renderWidth * 0.5;
        this._halfRenderHeight = dimensions.renderHeight * 0.5;
        this._sceneWidth = this._calcSceneWidth(dimensions);
        this._positionScene(dimensions);
        this._resizeCamera(dimensions);
    }

    _calcSceneWidth({ renderWidth }) {
        const panelWidth = Math.min(renderWidth * 0.63, Breakpoints.rem(895));
        const width = renderWidth - panelWidth;
        return width;
    }

    _positionScene({ renderWidth, renderHeight }) {
        const locale = useStore.getState().locale;
        let x = renderWidth * -0.5 + this._sceneWidth * 0.5;
        if (locale === 'ar-QA') {
            x = renderWidth * 0.5 - this._sceneWidth * 0.5;
        }
        const y = renderHeight * 0.5 + Breakpoints.rem(-250);
        this._scene.position.x = x;
        this._scene.position.y = y;
    }

    _resizeCamera({ renderWidth, renderHeight }) {
        this._camera.left = -renderWidth / 2.0;
        this._camera.right = renderWidth / 2.0;
        this._camera.top = renderHeight / 2.0;
        this._camera.bottom = -renderHeight / 2.0;
        this._camera.updateProjectionMatrix();
    }
}
