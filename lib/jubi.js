'use strict';

const crypto = require('crypto');
const querystring = require('querystring');
const request = require('request-promise');
const url = require('url');

const DOMAIN = 'https://www.jubi.com';

class Jubi {
    constructor({ key, secret, version = 'v1' }) {
        this._key = key || process.env.JUBI_KEY || '';
        secret = secret || process.env.JUBI_SECRET || '';
        this._version = version;
        this._secret = crypto.createHash('md5').update(secret).digest('hex');
        this._generatePublicMetheds();
    }

    async balance() {
        const api = this._makeApi('balance');
        return await this._post(api);
    }

    async tradeList(coin, all = 0, since = 0) {
        const type = all ? 'all' : 'open';
        const api = this._makeApi('trade_list');
        return await this._post(api, { coin, type, since });
    }

    async tradeView(coin, id) {
        const api = this._makeApi('trade_view');
        return await this._post(api, { coin, id });
    }

    async tradeCancel(coin, id) {
        const api = this._makeApi('trade_cancel');
        return await this._post(api, { coin, id });
    }

    async tradeAdd(type, { coin, price, amount }) {
        const api = this._makeApi('trade_add');
        return await this._post(api, { type, coin, price, amount });
    }

    async buy(coin, price, amount) {
        return await this.tradeAdd('buy', { coin, price, amount });
    }

    async sell(coin, price, amount) {
        return await this.tradeAdd('sell', { coin, price, amount });
    }

    async coins() {
        const allTickers = (await this.allticker()) || {};
        return Object.keys(allTickers) || [];
    }

    async getCurrentPrice(symbol) {
        const allTickers = (await this.allticker()) || {};
        const coins = Object.keys(allTickers) || [];
        if (!coins.includes(symbol)) return;

        return allTickers[symbol]['last'];
    }

    // Utils
    _generatePublicMetheds() {
        ['ticker', 'depth', 'orders', 'allticker'].forEach(item => {
            this[item] = async coin => {
                const api = this._makeApi(item);
                return await this._get(api, { coin });
            };
        });
    }

    _makeApi(name) {
        return `/api/${this._version}/${name}`;
    }

    _sign(params = {}) {
        params.key = this._key;
        params.nonce = (new Date().getTime()) + (Jubi.nonceIndex++);

        const temp = {};
        Object.keys(params).forEach(key => {
            temp[key] = params[key];
        });
        const qs = querystring.stringify(temp);
        params.signature = crypto.createHmac('sha256', this._secret).update(qs).digest('hex');
        return params;
    }

    async _get(api, qs) {
        try {
            const uri = DOMAIN + api;
            let result = await request.get(uri, qs);
            if ('string' === typeof result) {
                result = JSON.parse(result);
            }
            return result || {};
        } catch (e) {
            console.error('jubi sdk GET error', e);
            return {};
        }

    }

    async _post(api, params) {
        try {
            const uri = DOMAIN + api;
            const form = this._sign(params);
            let result = await request.post({ uri, form });
            if ('string' === typeof result) {
                result = JSON.parse(result);
            }
            return result || {};
        } catch (e) {
            console.error(`jubi sdk POST error [${api}]:`, e);
            return {};
        }
    }
}

Jubi.nonceIndex = 0;

module.exports = Jubi;