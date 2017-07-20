const Jubi = require('../index.js').Jubi;

const key = '';
const secret = '';

const jb = new Jubi({ key, secret });

async function balance() {
    console.log(await jb.balance());
}

async function tradeList() {
    console.log(await jb.tradeList('rss'));
}

async function allTicker() {
    console.log(await jb.allticker());
}

async function coins() {
    console.log(await jb.coins());
}

async function price() {
    console.log(await jb.getCurrentPrice('rss'));
}


//coins();
price();
balance();
tradeList();





