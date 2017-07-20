'use strict';

const Jubi = require('../').Jubi;
const market = require('../').market;
const assert = require('power-assert');

const coin = 'rss';

const key = '';
const secret = '';

const client = new Jubi({ key, secret });

describe('Jubi SDK test', function () {

    it('tradeList', async () => {
        const result = await client.tradeList(coin);
        assert(!!result);
        assert(result.code === undefined);
    });

    it('price', async () => {
        const result = await market.ticker(coin);
        assert(result > 0);
    });

    it('coins', async () => {
        const result = await market.coins(coin);
        assert(Array.isArray(result));
        assert(result.length > 0);
    });

    it('balance', async () => {
        const result = await client.balance();
        assert(!!result);
        assert(result.code === undefined);
    });

    ['ticker', 'depth', 'orders', 'allticker'].forEach(method => {
        it(method, async () => {
            const result = await client[method](coin)
            assert(!!result);
            assert(result.code === undefined);
        });
    });
});