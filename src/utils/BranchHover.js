import EventDispatcher from './EventDispatcher';

class BranchHover extends EventDispatcher {
    constructor() {
        super();

        this._mouseLeaveTimeout = {};
    }

    mouseEnter(id) {
        setTimeout(() => {
            clearTimeout(this._mouseLeaveTimeout[id]);
            this.dispatchEvent('mouseEnter', id);
            this._mouseLeaveTimeout[id] = null;
        }, 200);
    }

    mouseLeave(id) {
        clearTimeout(this._mouseLeaveTimeout[id]);
        this._mouseLeaveTimeout[id] = setTimeout(() => {
            this.dispatchEvent('mouseLeave', id);
        }, 300);
    }
}

export default new BranchHover();
