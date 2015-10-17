function Asset(symbol, price) {
  let asset = Object.create(Asset.prototype);
  // Validate parameters
  if (typeof symbol !== 'string') throw new TypeError('Expected symbol to be a string.');
  if (typeof price !== 'number' && !(price instanceof Number)) throw new TypeError('Expected price to be a number.');
  // Assign properties
  asset.symbol = symbol;
  asset.price = price;
  return asset;
}
export default Asset;
