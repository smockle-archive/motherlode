import Asset from './asset';
import Percent from './percent';
import USD from './usd'; const $ = USD;

// Symbols, current prices, current number of shares, ideal allocation in memory
  // TODO: Ask for symbols, current number of shares, ideal allocation (or read from file)

// Calculate current allocation

// Calculate difference between current allocation and ideal allocation for each symbol

function Portfolio(assets) {
  let portfolio = Object.create(Portfolio.prototype);
  portfolio.assets = Object.assign([], assets.map(asset => Object.assign({}, asset)));

  if (!(portfolio.assets instanceof Array))
    throw new TypeError('Expected input to be an array.');
  if (portfolio.assets.length === 0)
    throw new Error('Input array cannot be empty.');

  // Calculate net and validate each element in input array.
  portfolio.net = $(0);
  portfolio.assets.forEach((u) => {
    if (!u.hasOwnProperty('asset'))
      throw new TypeError('Input array contains an element without an asset key.');
    if (!u.hasOwnProperty('quantity'))
      throw new TypeError('Input array contains an element without a quantity key.');
    if (!u.hasOwnProperty('ideal'))
      throw new TypeError('Input array contains an element without an ideal key.');
    if (!(u.asset instanceof Asset))
      throw new TypeError('Input array contains an element with a bad asset value.');
    if (typeof u.quantity !== 'number' && !(u.quantity instanceof Number))
      throw new TypeError('Input array contains an element with a bad quantity value.');
    if (!(u.ideal instanceof Percent))
      throw new TypeError('Input array contains an element with a bad ideal value.');
    if (u.quantity < 0)
      throw new TypeError('Input array contains an element with a negative quantity.');
    if (u.ideal > 100)
      throw new TypeError('Input array contains an element with an impossibly high ideal.');
    portfolio.net += $(u.asset.price * u.quantity);
  });

  if (Math.abs(portfolio.assets.reduce((pct, a) => pct + a.ideal, 0)-Percent(100).valueOf()) > 0.000000001)
    throw new TypeError('Ideal allocations must sum to 100%.')

  // Set allocation and delta on each element in input array.
  portfolio.assets.forEach((u) => {
    u.allocation = portfolio.net !== 0 ?
                   Percent.fromDecimal(u.asset.price * u.quantity / portfolio.net) :
                   Percent(0);
    u.delta = Percent.fromDecimal(u.allocation - u.ideal);
  });

  return portfolio;
};

// Ask how many more dollars we want to allocate
  // TODO: Support deallocating [i.e. withdrawing] dollars
  // TODO: Support changing ideal allocation with existing number of dollars

// While dollars we want to allocate is greater than dollars we’ve allocated
  // Remove as many dollars we want to allocate as it takes to purchase one share of the symbol with the greatest [negative] difference

// Display current number of shares, recommended purchases of shares, and what the number of shares after purchase would be
  // TODO: Save symbols, [new] current number of shares, ideal allocation to file

Portfolio.prototype.load = function(amount) {
  if (!(amount instanceof $))
    throw new TypeError('Load amount must be in USD.');

  this.net = $(this.net + amount);

  const minPrice = this.assets.reduce((min, a) => Math.min(min, a.asset.price), Infinity);
  while(amount >= minPrice) {
    // Move asset with largest [negative] delta to the top.
    // If assets have very close deltas, sort assets with more significant deltas first.
    this.assets.sort((a, b) => {
      return Math.abs(a.delta - b.delta) < 0.01 ?
      (Math.abs(b.delta)/b.ideal) - (Math.abs(a.delta)/a.ideal) :
      a.delta - b.delta;
    });
    // Break if underallocated asset price is greater than remaining load amount.
    if (this.assets[0].asset.price > amount) break;
    this.assets[0].quantity++;
    amount -= this.assets[0].asset.price;
    // Set allocation and delta on each element in input array.
    this.assets.forEach((u) => {
      u.allocation = this.net !== 0 ?
                     Percent.fromDecimal(u.asset.price * u.quantity / this.net) :
                     Percent(0);
      u.delta = Percent.fromDecimal(u.allocation - u.ideal);
    });
  }

  // TODO: Implement Portfolio#unload for selling

  // TODO: Implement Portfolio#rebalance for buying + selling

  // Store uninvestable load amount as _CASH.
  if (amount > 0)
    this.assets.push({
      asset: Asset('_CASH', $(1)),
      quantity: Math.round(amount.valueOf() * Math.pow(10, 2)) / Math.pow(10, 2),
      ideal: Percent(0)
    });
};

Portfolio.prototype.serialize = () => this.holdings.map(holding => holding.toJSON());
Portfolio.deserialize = json => Portfolio(json.map(j => Holding.fromJSON(j)));

export default Portfolio;
