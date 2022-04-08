// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, CatmullRomCurve3, Vector3, ShaderMaterial, Float32BufferAttribute, BufferGeometry, Points, AdditiveBlending, Color } from 'three';
import { ResourceLoader } from 'resource-loader';

// Utils
import math from '@/utils/math';
import TreeParser from '@/webgl/utils/TreeParser';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles/fragment.glsl';

export default class TreeBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._debug = this._createDebug(options.debug);
        this._mesh = this._createMesh();

        // Settings
        this.position.y = -10;

        this.show();
    }

    destroy() {
        super.destroy();
        this._timelineShow?.kill();
    }

    /**
     * Public
     */
    show() {
        this._timelineShow = new gsap.timeline({ delay: 2.5 });
        // this._timelineShow.fromTo(this._mesh.material.uniforms.uProgress, 10, { value: 0 }, { value: 0.6, repeat: 0, repeatDelay: 2 });
        return this._timelineShow;
    }

    /**
     * Private
     */
    _createMesh() {
        const gltf = ResourceLoader.get('view/tree/tree');
        const model = gltf.scene.getObjectByName('Plane').clone();
        // this.add(model);

        const treeParse = new TreeParser({ model });
        const curves = this._createCurves(treeParse.branches);

        const amount = 50000;
        const vertices = [];
        const normals = [];
        const progress = [];
        const settings = [];
        const colors = [];

        for (let i = 0; i < amount; i++) {
            const data = this._getRandomCurve(curves);
            const curve = data.curve;

            const startOrder = data.startOrder;
            const endOrder = data.endOrder;

            const pointProgress = Math.random();
            const point = curve.getPointAt(pointProgress);

            const radius = 0;
            const angle = Math.random() * Math.PI * 2;

            const fract = pointProgress % 1;
            const indexStart = Math.floor(pointProgress * (data.frenetFrames.normals.length - 1));
            const indexEnd = Math.ceil(pointProgress * (data.frenetFrames.normals.length - 1));

            const N = new Vector3().lerpVectors(data.frenetFrames.normals[indexStart], data.frenetFrames.normals[indexEnd], fract);
            const B = new Vector3().lerpVectors(data.frenetFrames.binormals[indexStart], data.frenetFrames.binormals[indexEnd], fract);

            const sin = Math.sin(angle);
            const cos = -Math.cos(angle);

            const normal = new Vector3();
            normal.x = (cos * N.x + sin * B.x);
            normal.y = (cos * N.y + sin * B.y);
            normal.z = (cos * N.z + sin * B.z);
            normal.normalize();

            normals.push(normal.x, normal.y, normal.z);

            const vertex = new Vector3();
            vertex.x = point.x + radius * normal.x;
            vertex.y = point.y + radius * normal.y;
            vertex.z = point.z + radius * normal.z;

            vertices.push(vertex.x, vertex.y, vertex.z);

            const orderProgress = math.lerp(startOrder, endOrder, pointProgress);
            progress.push(orderProgress / 18);

            settings.push(Math.random()); // Offset
            settings.push(math.randomArbitrary(0.2, 1)); // Radius
            settings.push(math.randomArbitrary(0.7, 1)); // Scale
            settings.push(math.randomArbitrary(0.5, 1)); // Alpha

            colors.push(data.color.r, data.color.g, data.color.b);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('progress', new Float32BufferAttribute(progress, 1));
        geometry.setAttribute('settings', new Float32BufferAttribute(settings, 4));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        const colorGradient = ResourceLoader.get('view/tree/particles-color-gradient');
        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uColorGradient: { value: colorGradient },
                uProgress: { value: 0.65 },
                uPointSize: { value: 47 },
                uRadius: { value: 0.71 },
                uInnerGradient: { value: 0.88 },
                uOuterGradient: { value: 0.07 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });
        const mesh = new Points(geometry, material);
        this.add(mesh);

        if (this._debug) {
            this._debug.add(material.uniforms.uProgress, 'value', { label: 'progress' });
            this._debug.add(material.uniforms.uColorGradient, 'value', { label: 'gradient' });
            this._debug.add(material.uniforms.uInnerGradient, 'value', { label: 'inner gradient' });
            this._debug.add(material.uniforms.uOuterGradient, 'value', { label: 'outer gradient' });
            this._debug.add(material.uniforms.uRadius, 'value', { label: 'radius' });
            this._debug.add(material.uniforms.uPointSize, 'value', { label: 'point size', stepSize: 1 });
            this._debug.add(material.uniforms.uPointSize, 'value', { label: 'point size', stepSize: 1 });
        }

        return mesh;
    }

    _getRandomCurve(curves) {
        let sumOfWeight = 0;
        for (let i = 0, len = curves.length; i < len; i++) {
            sumOfWeight += curves[i].weight;
        }
        let random = sumOfWeight * Math.random();

        let item;
        for (let i = 0, len = curves.length; i < len; i++) {
            item = curves[i];
            if (random < item.weight) return item;
            random -= item.weight;
        }
    }

    _createCurves(branches) {
        const curves = [];
        for (let i = 0, len = branches.length; i < len; i++) {
            const branch = branches[i];

            const startOrder = branch[0].order;
            const endOrder = branch[branch.length - 1].order;

            const points = [];
            for (let i = 0, len = branch.length; i < len; i++) {
                const item = branch[i];
                points.push(item.vertex);
            }

            const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);
            const frenetFrames = curve.computeFrenetFrames(points.length, false);
            const color = new Color(Math.random(), Math.random(), Math.random());
            const weight = curve.points.length;

            curves.push({
                startOrder,
                endOrder,
                curve,
                frenetFrames,
                color,
                weight,
            });
        }
        return curves;
    }

    /**
     * Debug
     */
    _createDebug(debug) {
        if (!debug) return;
        const group = debug.addGroup('Branch');
        group.add(this, 'position');
        group.add(this, 'rotation');
        return group;
    }
}
