// Vendor
import { component } from '@/utils/bidello';
import { ArrowHelper, BoxBufferGeometry, BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

export default class GeneratedBranchComponent extends component(Object3D) {
    init(options = {}) {
        // Options
        this._debug = options.debug;
        this._data = options.data;
    }

    setup() {
        this._points = this._createPoints();
        this._mesh = this._createMesh();
        this._cameraAnchorsSubcategories = this._createCameraAnchorsSubcategories();
        // this._cameraAnchorsEntities = this._createCameraAnchorsEntities();
        // this._cameraPaths = this._createCameraPaths();
        this._bindHandlers();
        this._setupEventListeners();
    }

    destroy() {
        super.destroy();
        this._removeEventListeners();
    }

    /**
     * Public
     */
    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    getCameraAnchor(name) {
        const subcategories = this._data.subcategories;
        let item;
        for (let i = 0, len = subcategories.length; i < len; i++) {
            item = subcategories[i];
            if (item.name === name) {
                return this._cameraAnchorsSubcategories[i];
            }
        }
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

    _createPoints() {
        const pointsCategories = [];

        // Trunk
        pointsCategories.push(new Vector3(0, 0, 0));

        const currentPosition = new Vector3(0, 13, 0);
        pointsCategories.push(currentPosition);

        const pointsSubcategories = [];
        const pointsEntities = [];

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
            pointsSubcategories.push(currentPosition);

            const x = currentPosition.x + radius * Math.cos(angle);
            const y = currentPosition.y + 10;
            const z = currentPosition.z + radius * Math.sin(angle);

            // End position
            const endPosition = new Vector3(x, y, z);
            // points.push(endPosition);
            pointsSubcategories.push(endPosition);

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
                pointsEntities.push(startPosition);

                // End position
                const entityDirection = new Vector3().copy(direction);

                const r = 0.5;

                entityDirection.x += Math.random() * r * 2 - r;
                entityDirection.y += Math.random() * r * 2 - r;
                entityDirection.z += Math.random() * r * 2 - r;

                entityDirection.multiplyScalar(2);

                const entityEndPosition = new Vector3().copy(startPosition);
                entityEndPosition.sub(entityDirection);
                pointsEntities.push(entityEndPosition);
            });
        });

        return {
            categories: pointsCategories,
            subcategories: pointsSubcategories,
            entities: pointsEntities,
        };
    }

    _createMesh() {
        {
            const material = new LineBasicMaterial({ color: 0x0000ff });
            const geometry = new BufferGeometry().setFromPoints(this._points.categories);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }

        {
            const material = new LineBasicMaterial({ color: 0x00ff00 });
            const geometry = new BufferGeometry().setFromPoints(this._points.subcategories);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }

        {
            const material = new LineBasicMaterial({ color: 0xff0000 });
            const geometry = new BufferGeometry().setFromPoints(this._points.entities);
            const line = new LineSegments(geometry, material);
            this.add(line);
        }
    }

    _createCameraAnchorsSubcategories() {
        const pointsSubcategories = this._points.subcategories;
        const anchors = [];

        for (let i = 0, len = pointsSubcategories.length; i < len; i += 2) {
            const start = pointsSubcategories[i + 0];
            const end = pointsSubcategories[i + 1];

            const position = new Vector3().lerpVectors(start, end, 0.2);

            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(position);
            // mesh.visible = false;
            this.add(mesh);

            const origin = position.clone();

            const radius = 2;
            // const angle = Math.random() * Math.PI * 2;
            const angle = Math.PI * 0.4;
            origin.x += radius * Math.cos(angle);
            origin.z += radius * Math.sin(angle);

            origin.set(0, 15, 0);

            const geometryOrigin = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const materialOrigin = new MeshBasicMaterial({ color: 0xff00ff });
            const meshOrigin = new Mesh(geometryOrigin, materialOrigin);
            meshOrigin.position.copy(origin);
            // meshOrigin.visible = false;
            this.add(meshOrigin);

            const cameraPosition = new Vector3();
            meshOrigin.updateMatrixWorld();
            meshOrigin.getWorldPosition(cameraPosition);

            const cameraTarget = new Vector3();
            mesh.updateMatrixWorld();
            mesh.getWorldPosition(cameraTarget);

            anchors.push({
                origin: cameraPosition,
                target: cameraTarget,
            });

            const direction = new Vector3().copy(position).sub(origin).normalize();
            const length = 1;
            const hex = 0xffff00;

            const arrowHelper = new ArrowHelper(direction, origin, length, hex);
            // arrowHelper.visible = false;
            // this.add(arrowHelper);
        }

        return anchors;
    }

    _createCameraAnchorsEntities() {
        const pointsEntities = this._points.entities;
        const anchors = [];

        for (let i = 0, len = pointsEntities.length; i < len; i += 2) {
            const start = pointsEntities[i + 0];
            const end = pointsEntities[i + 1];

            const position = new Vector3().lerpVectors(start, end, 0.5);

            const geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            mesh.position.copy(position);
            // mesh.visible = false;
            this.add(mesh);

            const origin = position.clone();

            const radius = 2;
            const angle = Math.random() * Math.PI * 2;
            // const angle = Math.PI * 0.4;
            origin.x += radius * Math.cos(angle);
            origin.z += radius * Math.sin(angle);

            // origin.set(0, 15, 0);

            const geometryOrigin = new BoxBufferGeometry(0.1, 0.1, 0.1);
            const materialOrigin = new MeshBasicMaterial({ color: 0xff00ff });
            const meshOrigin = new Mesh(geometryOrigin, materialOrigin);
            meshOrigin.position.copy(origin);
            // meshOrigin.visible = false;
            this.add(meshOrigin);

            const cameraPosition = new Vector3();
            meshOrigin.updateMatrixWorld();
            meshOrigin.getWorldPosition(cameraPosition);

            const cameraTarget = new Vector3();
            mesh.updateMatrixWorld();
            mesh.getWorldPosition(cameraTarget);

            anchors.push({
                origin: cameraPosition,
                target: cameraTarget,
            });

            const direction = new Vector3().copy(position).sub(origin).normalize();
            const length = 1;
            const hex = 0xffff00;

            const arrowHelper = new ArrowHelper(direction, origin, length, hex);
            // arrowHelper.visible = false;
            // this.add(arrowHelper);
        }

        return anchors;
    }

    _createCameraPaths() {
        const start = this._cameraAnchorsSubcategories[0];
        const end = this._cameraAnchorsSubcategories[1];

        if (!end) return;

        const curve = new CatmullRomCurve3([
            start,
            end,
        ]);

        const points = curve.getPoints(50);
        const geometry = new BufferGeometry().setFromPoints(points);

        const material = new LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        const curveObject = new Line(geometry, material);

        this.add(curveObject);
    }

    /**
     * Handlers
     */
    _branchAddHandler(data) {
        // console.log(data);
    }
}
