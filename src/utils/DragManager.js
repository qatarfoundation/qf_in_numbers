// Utils
import EventDispatcher from '@/utils/EventDispatcher';
import device from '@/utils/device';
import math from '@/utils/math';
import frameTimeout from '@/utils/frameTimeout';

// Constants
const MAX_Y_ANGLE = Math.PI * 0.25;
const AXIS_CHECK_DELAY = 3; // Frames

export default class DragManager extends EventDispatcher {
    constructor(options) {
        super();

        // Options
        this._el = options.el;
        // this._el = window;

        // Flags
        this._isPointerDown = false;

        // Props
        this._position = { x: 0, y: 0 };
        this._startPosition = { x: 0, y: 0 };
        this._lockedAxis = null;

        // Setup
        this._bindHandlers();
        this._setupEventListeners();
    }

    destroy() {
        this._removeEventListeners();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._touchStartHandler = this._touchStartHandler.bind(this);
        this._touchMoveHandler = this._touchMoveHandler.bind(this);
        this._touchEndHandler = this._touchEndHandler.bind(this);
        this._mouseDownHandler = this._mouseDownHandler.bind(this);
        this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._mouseUpHandler = this._mouseUpHandler.bind(this);
    }

    _setupEventListeners() {
        if (device.isTouch()) {
            this._el.addEventListener('touchstart', this._touchStartHandler);
            this._el.addEventListener('touchmove', this._touchMoveHandler);
            this._el.addEventListener('touchend', this._touchEndHandler);
        } else {
            this._el.addEventListener('mousedown', this._mouseDownHandler);
            this._el.addEventListener('mousemove', this._mouseMoveHandler);
            this._el.addEventListener('mouseup', this._mouseUpHandler);
        }
    }

    _removeEventListeners() {
        if (device.isTouch()) {
            this._el.removeEventListener('touchstart', this._touchStartHandler);
            this._el.removeEventListener('touchmove', this._touchMoveHandler);
            this._el.removeEventListener('touchend', this._touchEndHandler);
        } else {
            this._el.removeEventListener('mousedown', this._mouseDownHandler);
            this._el.removeEventListener('mousemove', this._mouseMoveHandler);
            this._el.removeEventListener('mouseup', this._mouseUpHandler);
        }
    }

    _onPointerDown(x, y) {
        this._isPointerDown = true;
        this._updateStartPosition(x, y);
        this._updatePosition(x, y);
        this._triggerDragStartEvent();
        this._updateCheckAxis();
    }

    _onPointerMove(x, y) {
        const delta = {
            x: this._position.x - x,
            y: this._position.y - y,
        };

        if (this._checkAxis) {
            this._updateAxisLock(x, y);
            this._updatePosition(x, y);
            this._triggerDragMoveEvent(delta);
        }
    }

    _onPointerUp() {
        this._isPointerDown = false;
        this._lockedAxis = null;
        this._triggerDragEndEvent();
        this._updateStartPosition(null, null);
        this._updatePosition(null, null);
    }

    _updateStartPosition(x = null, y = null) {
        this._startPosition.x = x;
        this._startPosition.y = y;
    }

    _updatePosition(x = null, y = null) {
        this._position.x = x;
        this._position.y = y;
    }

    _updateCheckAxis() {
        this._checkAxis = false;
        if (this._checkAxisTimeout) this._checkAxisTimeout.cancel();
        this._checkAxisTimeout = frameTimeout(AXIS_CHECK_DELAY, () => {
            this._checkAxis = true;
        });
    }

    _updateAxisLock(x, y) {
        if (this._lockedAxis) return;

        const angle = Math.abs(math.angleBetweenPoints(this._startPosition, { x, y }) - Math.PI * 0.5);
        if ((angle > -MAX_Y_ANGLE && angle < MAX_Y_ANGLE) || (angle > Math.PI - MAX_Y_ANGLE && angle < Math.PI + MAX_Y_ANGLE)) {
            this._lockedAxis = 'y';
        } else {
            this._lockedAxis = 'x';
        }

        // Debug
        // this._updateDebugAngle(angle, MAX_Y_ANGLE);
    }

    /**
     * Triggers
     */
    _triggerDragStartEvent() {
        this.dispatchEvent('drag:start', {
            startPosition: this._startPosition,
        });
    }

    _triggerDragMoveEvent(delta) {
        this.dispatchEvent('drag:move', {
            delta,
            position: this._position,
            xAxisLocked: this._lockedAxis === 'x',
            yAxisLocked: this._lockedAxis === 'y',
        });
    }

    _triggerDragEndEvent() {
        const distance = math.distance(this._startPosition, this._position);

        this.dispatchEvent('drag:end', {
            endPosition: this._position,
            distance,
        });
    }

    /**
     * Handlers
     */
    _touchStartHandler(e) {
        const touch = e.touches[0];
        this._onPointerDown(touch.clientX, touch.clientY);
    }

    _touchMoveHandler(e) {
        if (this._isPointerDown) {
            const touch = e.touches[0];
            this._onPointerMove(touch.clientX, touch.clientY);
        }
    }

    _touchEndHandler() {
        this._onPointerUp();
    }

    _mouseDownHandler(e) {
        this._onPointerDown(e.clientX, e.clientY);
    }

    _mouseMoveHandler(e) {
        if (this._isPointerDown) {
            this._onPointerMove(e.clientX, e.clientY);
        }
    }

    _mouseUpHandler() {
        this._onPointerUp();
    }

    /**
     * Debug
     */
    _updateDebugAngle(angle, yMaxAngle) {
        const size = 50;

        if (!this._debugAngleContext) {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;
            canvas.style.cssText = 'position:fixed;left:10px;bottom:10px;';
            document.body.appendChild(canvas);
            this._debugAngleContext = canvas.getContext('2d');
        }

        const halfSize = size * 0.5;

        this._debugAngleContext.clearRect(0, 0, size, size);

        this._debugAngleContext.save();
        this._debugAngleContext.translate(halfSize, halfSize);

        // Background
        this._debugAngleContext.beginPath();
        this._debugAngleContext.fillStyle = 'black';
        this._debugAngleContext.arc(0, 0, halfSize, 0, Math.PI * 2);
        this._debugAngleContext.closePath();
        this._debugAngleContext.fill();

        // Max Y angle area top
        this._debugAngleContext.save();
        this._debugAngleContext.rotate(Math.PI * -0.5 - yMaxAngle);
        this._debugAngleContext.beginPath();
        this._debugAngleContext.fillStyle = 'rgba(0, 255, 0, 0.1)';
        this._debugAngleContext.moveTo(0, 0);
        this._debugAngleContext.arc(0, 0, halfSize, 0, yMaxAngle * 2);
        this._debugAngleContext.fill();
        this._debugAngleContext.closePath();
        this._debugAngleContext.restore();

        // Max Y angle area bottom
        this._debugAngleContext.save();
        this._debugAngleContext.rotate(Math.PI * 0.5 - yMaxAngle);
        this._debugAngleContext.beginPath();
        this._debugAngleContext.fillStyle = 'rgba(0, 255, 0, 0.1)';
        this._debugAngleContext.moveTo(0, 0);
        this._debugAngleContext.arc(0, 0, halfSize, 0, yMaxAngle * 2);
        this._debugAngleContext.fill();
        this._debugAngleContext.closePath();
        this._debugAngleContext.restore();

        // Line
        const radius = halfSize;
        const a = angle - Math.PI * 0.5;
        const x = radius * Math.cos(a);
        const y = radius * Math.sin(a);

        this._debugAngleContext.beginPath();
        this._debugAngleContext.moveTo(0, 0);
        this._debugAngleContext.lineTo(x, y);
        this._debugAngleContext.closePath();
        this._debugAngleContext.strokeStyle = 'red';
        this._debugAngleContext.stroke();

        this._debugAngleContext.restore();
    }
}
