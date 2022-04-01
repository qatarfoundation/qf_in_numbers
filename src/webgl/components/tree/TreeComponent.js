// Vendor
import { component } from '@/utils/bidello';
import { Object3D, CatmullRomCurve3, Vector3, BufferGeometry, LineBasicMaterial, Line, InstancedMesh, SphereGeometry, MeshBasicMaterial } from 'three';
import { ResourceLoader } from 'resource-loader';

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        this._mesh = this._createMesh();
    }

    /**
     * Private
     */
    _createMesh() {
        const gltf = ResourceLoader.get('tree');
        const model = gltf.scene.getObjectByName('Plane');
        this.add(model);

        const positions = model.geometry.getAttribute('position').array;

        const pointss = [];
        for (let i = 0, len = positions.length; i < len; i += 3) {
            pointss.push(new Vector3(positions[i + 0], positions[i + 1], positions[i + 2]));
        }

        const curve = new CatmullRomCurve3(pointss);

        const amount = 1000;

        const geometry = new SphereGeometry(0.1);
        const material = new MeshBasicMaterial();

        const mesh = new InstancedMesh(geometry, material, amount);
        this.add(mesh);

        const dummy = new Object3D();

        for (let i = 0; i < amount; i++) {
            const point = curve.getPointAt(Math.random());

            const radius = 1.0 - point.y / 20;

            const angle = Math.random() * Math.PI * 2;
            const x = point.x + radius * Math.cos(angle);
            const z = point.z + radius * Math.sin(angle);

            dummy.position.set(x, point.y, z);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
    }

    /**
     * Update
     */
    update({ time, delta }) {
    }
}
