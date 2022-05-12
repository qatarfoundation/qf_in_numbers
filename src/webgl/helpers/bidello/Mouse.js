// Vendor
import { Vector2 } from 'three';

// Utils
import bidello from '@/utils/bidello';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import DragManager from '@/utils/DragManager';

class Mouse {
    constructor() {
        // Props
        this._viewportWidth = null;
        this._viewportHeight = null;
        this._position = new Vector2();
        this._normalized = new Vector2();
        this._centered = new Vector2();

        // Setup
        this._bindHandlers();
    }

    init(options) {
        this._element = options.element;
        this._dragManager = this._createDragManager();
        this._setupEventListeners();
    }

    destroy() {
        this._removeEventListeners();
        this._dragManager?.destroy();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._resizeHandler = this._resizeHandler.bind(this);
        this._dragendHandler = this._dragendHandler.bind(this);
    }

    _setupEventListeners() {
        this._element.addEventListener('mousemove', this._mouseMoveHandler);
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        this._dragManager.addEventListener('drag:end', this._dragendHandler);
    }

    _removeEventListeners() {
        this._element.removeEventListener('mousemove', this._mouseMoveHandler);
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        this._dragManager.removeEventListener('drag:end', this._dragendHandler);
    }

    _createDragManager() {
        const dragManager = new DragManager({
            el: window,
        });
        return dragManager;
    }

    _updatePosition(x, y) {
        this._position.x = x;
        this._position.y = y;
    }

    _updateNormalizedPosition() {
        this._normalized.x = this._position.x / this._viewportWidth;
        this._normalized.y = 1.0 - this._position.y / this._viewportHeight;
    }

    _updateCenteredPosition() {
        this._centered.x = (this._position.x / this._viewportWidth) * 2 - 1;
        this._centered.y = -(this._position.y / this._viewportHeight) * 2 + 1;
    }

    /**
     * Triggers
     */
    _triggerBidelloMoveEvent() {
        bidello.trigger(
            {
                name: 'mousemove',
                fireAtStart: false,
            },
            {
                position: this._position,
                normalized: this._normalized,
                centered: this._centered,
            },
        );
    }

    _triggerBidelloClickEvent() {
        bidello.trigger(
            {
                name: 'click',
                fireAtStart: false,
            },
            {
                position: this._position,
                normalized: this._normalized,
                centered: this._centered,
            },
        );
    }

    /**
     * Handlers
     */
    _mouseMoveHandler(e) {
        this._updatePosition(e.clientX, e.clientY);
        this._updateNormalizedPosition();
        this._updateCenteredPosition();
        this._triggerBidelloMoveEvent();
    }

    _dragendHandler(e) {
        if (e.distance > 5) return; // Detect if drag or tap
        this._updatePosition(e.endPosition.x, e.endPosition.y);
        this._updateNormalizedPosition();
        this._updateCenteredPosition();
        this._triggerBidelloClickEvent();
    }

    _resizeHandler({ innerWidth, innerHeight }) {
        this._viewportWidth = innerWidth;
        this._viewportHeight = innerHeight;
    }
}

export default new Mouse();
