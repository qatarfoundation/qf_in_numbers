// Vendor
import { component } from '@/utils/bidello';
import { Object3D, CatmullRomCurve3, Vector3, ShaderMaterial, BoxBufferGeometry, Mesh, Color, Float32BufferAttribute, BufferGeometry, Points, PointsMaterial, LineBasicMaterial, Line, InstancedMesh, SphereGeometry, MeshBasicMaterial, AdditiveBlending } from 'three';
import { ResourceLoader } from 'resource-loader';

// Utils
import math from '@/utils/math';
import Debugger from '@/utils/Debugger';

// Shaders
import vertexShader from '@/webgl/shaders/tree-particles/vertex.glsl';
import fragmentShader from '@/webgl/shaders/tree-particles/fragment.glsl';

export default class TreeComponent extends component(Object3D) {
    init(options = {}) {
        this._mesh = this._createMesh();

        this.position.y = -10;

        this._progress = 0;
    }

    /**
     * Private
     */
    _createMesh() {
        const gltf = ResourceLoader.get('tree');
        const model = gltf.scene.getObjectByName('Plane').clone();
        // this.add(model);

        const positions = model.geometry.getAttribute('position').array;

        const pointss = [];
        for (let i = 0, len = positions.length; i < len; i += 3) {
            pointss.push(new Vector3(positions[i + 0], positions[i + 1], positions[i + 2]));
        }

        const branches = this._parseBranches(model);

        console.log(branches);

        const amount = 1000;

        const vertices = [];
        const progress = [];
        const offsets = [];

        for (let i = 0, len = branches.length; i < len; i++) {
            const branch = branches[i];

            const points = [];
            for (let i = 0, len = branch.length; i < len; i++) {
                const item = branch[i];
                points.push(item.vertex);
            }

            const startOrder = branch[0].order;
            const endOrder = branch[branch.length - 1].order;

            const curve = new CatmullRomCurve3(points);

            for (let i = 0; i < amount; i++) {
                const r = Math.random();

                const point = curve.getPointAt(r);
                const pointNext = curve.getPointAt(Math.min(r + 0.1, 1.0));

                const c = new CatmullRomCurve3([point, pointNext]);
                const frames = c.computeFrenetFrames(1, false);

                const radius = 0.3;

                const angle = Math.random() * Math.PI * 2;

                const N = frames.normals[0];
                const B = frames.binormals[0];

                const sin = Math.sin(angle);
                const cos = -Math.cos(angle);

                const normal = new Vector3();
                normal.x = (cos * N.x + sin * B.x);
                normal.y = (cos * N.y + sin * B.y);
                normal.z = (cos * N.z + sin * B.z);
                normal.normalize();

                const vertex = new Vector3();
                vertex.x = point.x + radius * normal.x;
                vertex.y = point.y + radius * normal.y;
                vertex.z = point.z + radius * normal.z;

                vertices.push(vertex.x, vertex.y, vertex.z);

                const p = math.lerp(startOrder, endOrder, r);
                progress.push(p / 18);

                offsets.push(Math.random());
            }

            // const color = new Color();
            // color.r = Math.random();
            // color.g = Math.random();
            // color.b = Math.random();
            // const material = new PointsMaterial({ color: color, size: 0.5, sizeAttenuation: true });
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('progress', new Float32BufferAttribute(progress, 1));
        geometry.setAttribute('offset', new Float32BufferAttribute(offsets, 1));

        const material = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uProgress: { value: 1 },
            },
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });
        const mesh = new Points(geometry, material);
        this.add(mesh);

        const debug = Debugger.addGroup('Tree', { container: 'Home' });
        debug.add(material.uniforms.uProgress, 'value');

        return mesh;
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
                current = [];
                current.push(start, end);
                indicesBranches.push(current);
            } else {
                current.push(start, end);
            }

            previousEnd = end;
        }

        for (var i = indicesBranches.length - 1; i >= 0; i--) {
            const branch = indicesBranches[i];
            const start = branch[0];

            const isInBranches = this._isInBranches(indicesBranches, start);
            if (isInBranches) {
                isInBranches.push(...branch);
                indicesBranches.splice(i, 1);
            }
        }

        const mainBranchIndex = 21;
        const mainBranch = indicesBranches[mainBranchIndex];
        const order = [[]];
        let lastIndex = 0;

        const flat = [];

        for (let i = 0, len = mainBranch.length; i < len; i += 2) {
            const start = mainBranch[i + 0];
            const end = mainBranch[i + 1];
            order[0].push({
                index: start,
                order: lastIndex,
            }, {
                index: end,
                order: lastIndex + 1,
            });

            flat.push({
                index: start,
                order: lastIndex,
            }, {
                index: end,
                order: lastIndex + 1,
            });

            lastIndex++;
        }

        for (let i = 0, len = indicesBranches.length; i < len; i++) {
            const branch = indicesBranches[i];
            if (i === mainBranchIndex || branch.length === 0) continue;

            const current = [];
            order.push(current);

            for (let j = 0, lenJ = branch.length; j < lenJ; j += 2) {
                const start = branch[j + 0];
                const end = branch[j + 1];

                for (let k = 0, lenK = flat.length; k < lenK; k++) {
                    const item = flat[k];
                    if (start === item.index) {
                        lastIndex = item.order;
                        break;
                    }
                }

                current.push({
                    index: start,
                    order: lastIndex,
                }, {
                    index: end,
                    order: lastIndex + 1,
                });

                flat.push({
                    index: start,
                    order: lastIndex,
                }, {
                    index: end,
                    order: lastIndex + 1,
                });

                lastIndex++;
            }
        }

        const branches = [];
        let newIndex = 0;
        for (let i = 0, len = order.length; i < len; i++) {
            const branch = order[i];

            branches[newIndex] = [];
            for (let j = 0, lenJ = branch.length; j < lenJ; j++) {
                const item = branch[j];
                const index = item.index;
                const x = positions[index * 3 + 0];
                const y = positions[index * 3 + 1];
                const z = positions[index * 3 + 2];
                item.vertex = new Vector3(x, y, z);
            }
            newIndex++;
        }

        return order;
        // return [branches[20]];
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
        this.rotation.y += 0.005;

        this._progress += 0.002;
        this._progress = this._progress % 1;

        this._mesh.material.uniforms.uProgress.value = this._progress;

        // this._mesh.scale.set(this._progress * 0.6, this._progress * 0.6, this._progress * 0.6);
    }
}
