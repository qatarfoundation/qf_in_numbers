// Vendor
import { Vector3 } from 'three';

// Utils
import math from '@/utils/math';

// Constants
const MAIN_BRANCH_INDEX = 1;

export default class TreeParser {
    constructor(options = {}) {
        this._branches = this._parseBranches(options.model);
    }

    /**
     * Getters & Setters
     */
    get branches() {
        return this._branches;
    }

    /**
     * Private
     */
    _parseBranches(model) {
        const positions = model.geometry.getAttribute('position').array;
        const indices = model.geometry.index.array;
        const branchesIndices = this._sortBranchIndices(indices);

        const mainBranch = branchesIndices[MAIN_BRANCH_INDEX];
        const order = [[]];
        const flat = [];
        let lastIndex = 0;

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

        for (let i = 0, len = branchesIndices.length; i < len; i++) {
            const branch = branchesIndices[i];
            if (i === MAIN_BRANCH_INDEX || branch.length === 0) continue;

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

                lastIndex += math.randomInt(0, 1);

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
    }

    _sortBranchIndices(indices) {
        const branches = [[]];

        let current = branches[0];
        let previousEnd = 0;
        for (let i = 0, len = indices.length; i < len; i += 2) {
            const start = indices[i + 0];
            const end = indices[i + 1];

            if (start !== previousEnd) {
                current = [];
                current.push(start, end);
                branches.push(current);
            } else {
                current.push(start, end);
            }

            previousEnd = end;
        }

        for (let i = branches.length - 1; i >= 0; i--) {
            const branch = branches[i];
            const start = branch[0];

            const isInBranches = this._isInBranches(branches, start);
            if (isInBranches) {
                isInBranches.push(...branch);
                branches.splice(i, 1);
            }
        }

        return branches;
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
}
