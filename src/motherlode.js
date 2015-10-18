// Symbols, current prices, current number of shares, ideal allocation in memory
  // TODO: Look up current prices
  // TODO: Ask for symbols, current number of shares, ideal allocation (or read from file)

// Calculate current allocation

// Calculate difference between current allocation and ideal allocation for each symbol

// Ask how many more dollars we want to allocate
  // TODO: Support deallocating [i.e. withdrawing] dollars
  // TODO: Support changing ideal allocation with existing number of dollars

// While dollars we want to allocate is greater than dollars we’ve allocated
  // Remove as many dollars we want to allocate as it takes to purchase one share of the symbol with the greatest [negative] difference

// Display current number of shares, recommended purchases of shares, and what the number of shares after purchase would be
  // TODO: Save symbols, [new] current number of shares, ideal allocation to file

import Asset from './asset';
import Percent from './percent';
import USD from './usd'; const $ = USD;

export default function Motherlode(unallocated) {
  if (!(unallocated instanceof Array))
    throw new TypeError('Expected input to be an array.');
  if (unallocated.length === 0)
    throw new Error('Input array cannot be empty.');

  // Calculate net and validate each element in input array.
  let net = $(0);
  unallocated.forEach((u) => {
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
    net += $(u.asset.price * u.quantity);
  });

  // Set allocation and delta on each element in input array.
  unallocated.forEach((u) => {
    u.allocation = Percent.fromDecimal(u.asset.price * u.quantity / net);
    u.delta = Percent.fromDecimal(u.allocation - u.ideal);
  });

  return Object.assign(unallocated);
};
