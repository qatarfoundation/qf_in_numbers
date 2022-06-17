// Vendor
import { gsap } from 'gsap';
import { component } from '@/utils/bidello';
import { Object3D, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, CatmullRomCurve3, SphereBufferGeometry, QuadraticBezierCurve3, LineBasicMaterial, Line, BufferGeometry } from 'three';

// Utils
import math from '@/utils/math';
import Debugger from '@/utils/Debugger';

export default class LeavesComponent extends component(Object3D) {
    init(options = {}) {
        this._mesh = this._createMesh();

        this._progress = 1;

        // this.visible = false;

        // gsap.fromTo(this, 4, { _progress: 0 }, {
        //     _progress: 1, repeat: 0, repeatDelay: 2, delay: options.delay, onStart: () => {
        //         this.visible = true;
        //         this._start = true;

        //         let item;
        //         for (let i = 0, len = this._points.length; i < len; i++) {
        //             item = this._points[i];
        //             item.mesh.material.opacity = math.randomArbitrary(0.1, 1.0);
        //         }
        //     },
        // });

        if (Debugger) {
            const debug = Debugger.addGroup('Leaves', { container: 'Home' });
            debug.add(this, 'position');
            debug.add(this.rotation, 'x');
            debug.add(this.rotation, 'y');
            debug.add(this.rotation, 'z');
        }
    }

    /**
     * Private
     */
    _createMesh() {
        const amount = 1000;

        const startPoint = new Vector3(0, 0, 0);

        {
            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(startPoint);
            this.add(mesh);
        }

        this._points = [];

        const group = new Object3D();
        this.add(group);

        for (let i = 0; i < amount; i++) {
            const radius = 6 + Math.random();

            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * 0.5;
            const x = startPoint.x + (r * Math.sin(phi) * Math.cos(theta));
            const y = startPoint.y + (r * Math.sin(phi) * Math.sin(theta)) + 2.0;
            const z = startPoint.z + (r * Math.cos(phi));
            const middlePoint = new Vector3(x, y, z);

            const endPoint = new Vector3();
            {
                // const u = Math.random();
                // const v = Math.random();
                const theta = 2 * Math.PI * u;
                const phi = Math.acos(2 * v - 1);
                const x = startPoint.x + (radius * Math.sin(phi) * Math.cos(theta));
                const y = startPoint.y + (radius * Math.sin(phi) * Math.sin(theta));
                const z = startPoint.z + (radius * Math.cos(phi));
                endPoint.set(x, y, z);
            }

            //Create a closed wavey loop
            const curve = new QuadraticBezierCurve3(
                startPoint,
                middlePoint,
                endPoint,
            );

            const points = curve.getPoints(50);
            const lineGeometry = new BufferGeometry().setFromPoints(points);
            const lineMaterial = new LineBasicMaterial({ color: 0xffffff });
            const curveObject = new Line(lineGeometry, lineMaterial);
            this.add(curveObject);

            {
                const geometry = new BoxBufferGeometry(0.05, 0.05, 0.05);
                const material = new MeshBasicMaterial({ color: 0x00ff00 });
                const mesh = new Mesh(geometry, material);
                mesh.position.copy(middlePoint);
                // this.add(mesh);
            }

            const alpha = math.randomArbitrary(0.1, 1.0);
            const geometry = new SphereBufferGeometry(0.05, 12, 12);
            const material = new MeshBasicMaterial({ color: 0x6eceb2, transparent: true, opacity: 0 });
            const mesh = new Mesh(geometry, material);
            // mesh.position.copy(endPoint);

            const scale = math.randomArbitrary(0.5, 1.0);
            mesh.scale.set(scale, scale, scale);

            group.add(mesh);

            this._points.push({
                curve,
                mesh,
                speed: math.randomArbitrary(0.5, 1.0),
                progress: math.randomArbitrary(-1, 0),
            });
        }

        return group;
    }

    /**
     * Update
     */
    // update({ time, delta }) {
    //     // const progress = time * 0.1 % 1;

    //     if (!this._start) return;

    //     let item;
    //     for (let i = 0, len = this._points.length; i < len; i++) {
    //         item = this._points[i];

    //         item.progress += 0.009;

    //         const progress = math.clamp(item.progress, 0, 1);

    //         const position = item.curve.getPointAt(this._progress * item.speed);
    //         item.mesh.position.copy(position);
    //     }
    // }
}
