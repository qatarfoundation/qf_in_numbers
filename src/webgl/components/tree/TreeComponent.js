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
        const model = gltf.scene.getObjectByName('Plane').clone();
        this.add(model);

        const positions = model.geometry.getAttribute('position').array;

        const pointss = [];
        for (let i = 0, len = positions.length; i < len; i += 3) {
            pointss.push(new Vector3(positions[i + 0], positions[i + 1], positions[i + 2]));
        }

        const branches = this._parseBranches(model);

        const amount = 1000;

        const geometry = new SphereGeometry(0.1);
        const material = new MeshBasicMaterial();

        const mesh = new InstancedMesh(geometry, material, amount * branches.length);
        this.add(mesh);

        const dummy = new Object3D();

        let index = 0;
        for (let i = 0, len = branches.length; i < len; i++) {
            const curve = new CatmullRomCurve3(branches[i]);

            for (let i = 0; i < amount; i++) {
                const point = curve.getPointAt(Math.random());

                const radius = (1.0 - point.y / 30) * 1;
                // const radius = 0.2;

                const angle = Math.random() * Math.PI * 2;
                const x = point.x + radius * Math.cos(angle);
                const z = point.z + radius * Math.sin(angle);

                dummy.position.set(x, point.y, z);
                dummy.updateMatrix();
                mesh.setMatrixAt(index, dummy.matrix);

                index++;
            }
        }
    }

    _parseBranches(model) {
        const positions = model.geometry.getAttribute('position').array;
        const indices = model.geometry.index.array;

        const vertices = [];
        for (let i = 0, len = positions.length; i < len; i += 3) {
            vertices.push(new Vector3(positions[i + 0], positions[i + 1], positions[i + 2]));
        }

        const indicesBranches = [[]];
        let current = indicesBranches[0];
        let previousEnd = 0;

        for (let i = 0, len = indices.length; i < len; i += 2) {
            const start = indices[i + 0];
            const end = indices[i + 1];

            if (start !== previousEnd) {
                const isInBranches = this._isInBranches(indicesBranches, start);
                if (isInBranches) {
                    isInBranches.push(start, end);
                } else {
                    current = [];
                    indicesBranches.push(current);
                    current.push(start, end);
                }
            } else if (this._isInBranch(current, start + 1)) {
                current = [];
                indicesBranches.push(current);
                current.push(start, end);
            } else {
                current.push(start, end);
            }

            previousEnd = end;
        }

        const branches = [];
        let newIndex = 0;
        for (let i = 0, len = indicesBranches.length; i < len; i++) {
            const branch = indicesBranches[i];

            if (branch.length > 0) {
                branches[newIndex] = [];
                for (let j = 0, lenJ = branch.length; j < lenJ; j++) {
                    const index = branch[j];
                    const x = positions[index * 3 + 0];
                    const y = positions[index * 3 + 1];
                    const z = positions[index * 3 + 2];
                    branches[newIndex].push(new Vector3(x, y, z));
                }
                newIndex++;
            }
        }

        return branches;
        // return [branches[62]];
    }

    _isInBranch(branch, index)  {
        for (let i = 0, len = branch.length; i < len; i += 2) {
            const end = branch[i + 1];
            if (end === index) return true;
        }
        return false;
    }

    _isInBranches(branches, index)  {
        for (let i = 0, len = branches.length; i < len; i++) {
            const branch = branches[i];
            for (let j = 0, lenJ = branch.length; j < lenJ; j += 2) {
                const end = branch[j + 1];
                if (end === index && j + 1 === lenJ - 1) return branch;
            }
        }
        return false;
    }

    /**
     * Update
     */
    update({ time, delta }) {
    }
}
