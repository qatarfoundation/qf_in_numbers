// Vendor
import { component } from '@/utils/bidello';
import { BufferGeometry, Euler, Line, LineBasicMaterial, LineSegments, Matrix4, Object3D, Vector3 } from 'three';

// Utils
import Debugger from '@/utils/Debugger';
import TreeDataModel from '@/utils/TreeDataModel';

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debug = options.debug;
        this._data = options.data;

        // Setup
        this._mesh = this._createMesh();

        this._bindHandlers();
        this._setupEventListeners();
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._branchAddHandler = this._branchAddHandler.bind(this);
    }

    _setupEventListeners() {
        TreeDataModel.addEventListener('branch/add', this._branchAddHandler);
    }

    _removeEventListeners() {
        TreeDataModel.removeEventListener('branch/add', this._branchAddHandler);
    }

    _createMesh() {
        const points = [];

        // Trunk
        points.push(new Vector3(0, 0, 0));

        const currentPosition = new Vector3(0, 13, 0);
        points.push(currentPosition);

        const sc = [];
        const it = [];

        // Subcategories
        const subcategories = this._data.subcategories;
        const subcategoriesLength = subcategories.length;
        // const angleStep = Math.PI * 0.3;
        const angleStep = (Math.PI * 2) / subcategoriesLength;
        const angleOffset = Math.PI * 0.5 - angleStep * (subcategoriesLength - 1) * 0.5;
        subcategories.forEach((subcategory, index) => {
            const radius = 8;
            // const angle = angleOffset + index * angleStep;
            const angle = index * angleStep;

            // Start position
            // points.push(currentPosition);
            sc.push(currentPosition);

            const x = currentPosition.x + radius * Math.cos(angle);
            const y = currentPosition.y + 10;
            const z = currentPosition.z + radius * Math.sin(angle);

            // End position
            const endPosition = new Vector3(x, y, z);
            // points.push(endPosition);
            sc.push(endPosition);

            const direction = new Vector3();
            direction.copy(currentPosition);
            direction.sub(endPosition);
            direction.normalize();

            const entities = [...subcategory.entities, ...subcategory.entities];
            const entitiesLength = entities.length;
            const entityAngleStep = Math.PI * 0.2;
            entities.forEach((entity, index) => {
                const step = (index + 1) / (entitiesLength);

                // Start position
                const startPosition = new Vector3().lerpVectors(currentPosition, endPosition, step);
                it.push(startPosition);

                // End position
                const entityDirection = new Vector3().copy(direction);

                const r = 0.5;

                entityDirection.x += Math.random() * r * 2 - r;
                entityDirection.y += Math.random() * r * 2 - r;
                entityDirection.z += Math.random() * r * 2 - r;

                entityDirection.multiplyScalar(2);

                const entityEndPosition = new Vector3().copy(startPosition);
                entityEndPosition.sub(entityDirection);
                it.push(entityEndPosition);
            });
        });

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new LineSegments(geometry, material);
        this.add(line);

        {
            const material = new LineBasicMaterial({ color: 0x00ff00 });
            const geometry = new BufferGeometry().setFromPoints(sc);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }

        {
            const material = new LineBasicMaterial({ color: 0xff0000 });
            const geometry = new BufferGeometry().setFromPoints(it);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }
    }

    /**
     * Handlers
     */
    _branchAddHandler(data) {
        console.log(data);
    }
}
