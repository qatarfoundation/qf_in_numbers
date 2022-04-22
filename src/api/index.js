const contentful = require('contentful');

const configDelivery = {
    space: process.env.GATSBY_CTF_SPACE_ID,
    accessToken: process.env.GATSBY_CTF_CDA_ACCESS_TOKEN_DELIVERY,
};

const configDeliveryPreview = {
    space: process.env.GATSBY_CTF_SPACE_ID,
    accessToken: process.env.GATSBY_CTF_CDA_ACCESS_TOKEN_DELIVERY_PREVIEW,
    host: 'preview.contentful.com',
};

class Api {
    constructor() {
        this._preview = process.env.GATSBY_CTF_PREVIEW;
        this._client = this._createClient();
    }

    /**
     * Public
     */

    /**
     * Returns the list of entries
     * @returns {Array.<Object>} List of all entries
     */
    async getEntries(options = {}) {
        let res;
        try {
            res = await this._client.getEntries({
                include: 10,
                ...options,
            });
        } catch (err) {
            return new Error(err);
        }
        return res;
    }

    /**
     * Returns the list of entries by types
     * @param {String} type entry type
     * @returns {Array.<Object>} List of entries
     */
    async getEntriesByType(type, options = {}) {
        let res;
        try {
            res = await this._client.getEntries({
                content_type: type,
                include: 10,
                ...options,
            });
        } catch (err) {
            return new Error(err);
        }
        return res;
    }

    /**
     * Returns the entry needed by its id
     * @param {String} id entry id
     * @returns {Object} return the entry
     */
    async getEntryById(id, options = {}) {
        let res;
        try {
            res = await this._client.getEntry(id, {
                include: 10,
                ...options,
            });
        } catch (err) {
            return new Error(err);
        }
        return res;
    }

    /**
     * Private
     */
    _createClient() {
        const config = this._preview ? configDeliveryPreview : configDelivery;
        const client = contentful.createClient(config);

        return client;
    }
}

module.exports = new Api();