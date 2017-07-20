'use strict';

const Jubi = require('./lib/jubi.js');

module.exports = {
    market: {
        coins,
        ticker,
    },
    Jubi,
}

async function coins() {
    const jb = new Jubi({});
    return await jb.coins();
}

async function ticker(symbol) {
    const jb = new Jubi({});
    return await jb.getCurrentPrice(symbol);
}
