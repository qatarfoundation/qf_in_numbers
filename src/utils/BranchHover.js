import EventDispatcher from './EventDispatcher';

class BranchHover extends EventDispatcher {
    constructor() {
        super();
    }

    mouseEnter(id) {
        this._mouseEnterTimeout = setTimeout(() => {
            clearTimeout(this._mouseLeaveTimeout);
            this.dispatchEvent('mouseEnter', id);
            this._mouseLeaveTimeout = null;
        }, 200);
    }

    mouseLeave(id) {
        clearTimeout(this._mouseEnterTimeout);
        this._mouseLeaveTimeout = setTimeout(() => {
            this.dispatchEvent('mouseLeave', id);
        }, 400);
    }
}

export default {
    community: new BranchHover(),
    research: new BranchHover(),
    education: new BranchHover(),
};
