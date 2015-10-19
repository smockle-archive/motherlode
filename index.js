import Portfolio from './src/portfolio';
import Asset from './src/asset';
import Percent from './src/percent';
import USD from './src/usd'; const $ = USD;
import Immutable from './src/immutable';
import YahooFinance from 'yahoo-finance';

// TODO: Print unallocated and allocated portfolio when --verbose is set
// TODO: Read load amount from STDIN/argv

let assets = [{
  asset: Asset('VTI', $(105)),
  quantity: 0,
  ideal: Percent(30)
}, {
  asset: Asset('VBR', $(102.47)),
  quantity: 0,
  ideal: Percent(10)
}, {
  asset: Asset('VEU', $(45.79)),
  quantity: 0,
  ideal: Percent(15)
}, {
  asset: Asset('VSS', $(95.98)),
  quantity: 0,
  ideal: Percent(5)
}, {
  asset: Asset('BND', $(82.05)),
  quantity: 0,
  ideal: Percent(20)
}, {
  asset: Asset('TLT', $(123.71)),
  quantity: 0,
  ideal: Percent(15)
}, {
  asset: Asset('IAU', $(11.35)),
  quantity: 0,
  ideal: Percent(5)
}];

YahooFinance.snapshot({
  fields: ['a'],
  symbols: assets.map(a => a.asset.symbol)
})
// Update prices
.then(snapshot => {
  snapshot.forEach(s => {
    assets.find(a => a.asset.symbol === s.symbol).asset.price = $(s.ask);
  });
})
// Load portfolio
.then(() => {
  assets = Immutable(assets);
  let portfolio = Portfolio(assets);
  portfolio.load($(30000));

  // Print new portfolio
  console.log(portfolio.assets);

  // Print actions
  assets.forEach((unallocated) => {
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
})
// Catch errors
.catch(console.error.bind(console));
