// Vendor
import { component } from '@/utils/bidello';
import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Object3D, Vector3 } from 'three';

export default class EntityComponent extends component(Object3D) {
    init(options = {}) {
        this._curve = this._createCurve();
        // this._skeleton = this._createSkeleton();
        this._particles = this._createParticles();
    }

    destroy() {
        super.destroy();
    }

    /**
     * Public
     */
    show(data) {

    }

    hide() {

    }

    /**
     * Private
     */
    _createCurve() {
        const amount = 10;
        const points = [];

        for (let i = 0; i < amount; i++) {
            const point = new Vector3(0, i * 1, 0);
            points.push(point);
        }

        const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0);
        return curve;
    }

    _createSkeleton() {
        const points = this._curve.getPoints(10);
        console.log(points);
        const material = new LineBasicMaterial({ color: 0x0000ff });
        const geometry = new BufferGeometry().setFromPoints(points);
        const skeleton = new Line(geometry, material);
        this.add(skeleton);
        return skeleton;
    }

    _createParticles() {

    }
}
