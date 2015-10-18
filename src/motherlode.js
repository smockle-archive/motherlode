import Asset from './asset';
import Percent from './percent';
import USD from './usd'; const $ = USD;

// Symbols, current prices, current number of shares, ideal allocation in memory
  // TODO: Look up current prices
  // TODO: Ask for symbols, current number of shares, ideal allocation (or read from file)

// Calculate current allocation

// Calculate difference between current allocation and ideal allocation for each symbol

function Motherlode(assets) {
  let motherlode = Object.create(Motherlode.prototype);

  if (!(assets instanceof Array))
    throw new TypeError('Expected input to be an array.');
  if (assets.length === 0)
    throw new Error('Input array cannot be empty.');

  // Calculate net and validate each element in input array.
  motherlode.net = $(0);
  assets.forEach((u) => {
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
    motherlode.net += $(u.asset.price * u.quantity);
  });

  // Set allocation and delta on each element in input array.
  assets.forEach((u) => {
    u.allocation = Percent.fromDecimal(u.asset.price * u.quantity / motherlode.net);
    u.delta = Percent.fromDecimal(u.allocation - u.ideal);
  });

  motherlode.assets = Object.assign(assets);
  return motherlode;
};

// Ask how many more dollars we want to allocate
  // TODO: Support deallocating [i.e. withdrawing] dollars
  // TODO: Support changing ideal allocation with existing number of dollars

// While dollars we want to allocate is greater than dollars we’ve allocated
  // Remove as many dollars we want to allocate as it takes to purchase one share of the symbol with the greatest [negative] difference

// Display current number of shares, recommended purchases of shares, and what the number of shares after purchase would be
  // TODO: Save symbols, [new] current number of shares, ideal allocation to file

Motherlode.prototype.load = function(amount) {
  if (!(amount instanceof $))
    throw new TypeError('Load amount must be in USD.');

  this.net = $(this.net + amount);

  const unallocated = Object.assign(this.assets);
  const minPrice = this.assets.reduce((min, a) => Math.min(min, a.asset.price), Infinity);
  while(amount >= minPrice) {
    // Move asset with largest [negative] delta to the top.
    // If multiple assets have the same delta, sort by price.
    this.assets.sort((a, b) => {
      return a.delta - b.delta === 0 ?
      a.asset.price - b.asset.price :
      a.delta - b.delta;
    });
    // Break if underallocated asset price is greater than remaining load amount.
    if (this.assets[0].asset.price > amount) break;
    this.assets[0].quantity++;
    amount -= this.assets[0].asset.price;
  }

  // Store uninvestable load amount as _CASH.
  if (amount > 0)
    this.assets.push({
      asset: Asset('_CASH', $(1)),
      quantity: amount.valueOf(),
      ideal: Percent(0)
    });
};

export default Motherlode;
