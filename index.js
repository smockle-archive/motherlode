import Portfolio from './src/portfolio';
import Asset from './src/asset';
import Percent from './src/percent';
import USD from './src/usd'; const $ = USD;
import Immutable from './src/immutable';
import YahooFinance from 'yahoo-finance';
import fs from 'fs';

const PATH = './data/tda_taxable.json';
const AMOUNT = 500;

// TODO: Print unallocated and allocated portfolio when --verbose is set
// TODO: Read load amount from STDIN/argv
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  })
}

// https://github.com/pilwon/node-yahoo-finance/blob/master/examples/promise/snapshot-multiple.js
function lookupPrices(assets) {
  return YahooFinance.snapshot({
    fields: ['l1'],
    symbols: assets.map(a => a.asset.symbol)
  })
  // Update prices
  .then(snapshot => {
    snapshot.forEach(s => {
      assets.find(a => a.asset.symbol === s.symbol).asset.price = $(s.lastTradePriceOnly);
    });
    return assets;
  });
}

function printTransactions(portfolio) {
  portfolio.unallocated.forEach((unallocated) => {
    const allocated = portfolio.assets.find((a) => a.asset.symbol === unallocated.asset.symbol) || { quantity: 0 };
    const delta = allocated.quantity - unallocated.quantity;
    if (delta === 0) return;
    if (delta > 0)
      console.log(`Buy ${delta} shares of ${allocated.asset.symbol}`);
    if (delta < 0)
      console.log(`Sell ${Math.abs(delta)} shares of ${allocated.asset.symbol}`);
  });
  const _cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
  if (_cash && _cash.quantity !== 0) console.log(`\$${_cash.quantity} in cash remaining`);
}

// Read portfolio from disk
readFile('./data/tda_taxable.json')
.then(JSON.parse)
// Convert portfolio json to objects
.then(Portfolio.deserialize)
// Load latest price info
.then(lookupPrices)
// Add funds to the portfolio
.then(assets => {
  let portfolio = Portfolio(Immutable(assets));
  portfolio.load($(AMOUNT));
  return { unallocated: assets, allocated: portfolio.assets };
})
// List buy and sell actions
.then(printTransactions)
// Catch errors
.catch(console.error.bind(console));
