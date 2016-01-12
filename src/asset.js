import USD from './usd'; const $ = USD;

function Asset(symbol, price) {
  let asset = Object.create(Asset.prototype);
  // Validate parameters
  if (typeof symbol !== 'string')
    throw new TypeError('Expected symbol to be a string.');
  if (symbol.length === 0)
    throw new TypeError('Symbol is too short.');
  // TODO: Check whether symbol exists
  if (!(price instanceof $))
    throw new TypeError('Expected price to be in USD.');
  if (price <= 0)
    throw new TypeError('Price must be greater than zero.');
  // Assign properties
  asset.symbol = symbol;
  asset.price = price;
  return asset;
}
Asset.prototype.serialize = function() {
  return JSON.stringify({
    symbol: this.symbol,
    price: this.price.valueOf()
  });
};
Asset.deserialize = function(json) {
  if (!json.hasOwnProperty('symbol'))
    throw new TypeError('Provided asset object must include a symbol key.');
  if (!json.hasOwnProperty('price'))
    throw new TypeError('Provided asset object must include a price key.');
  if (typeof json.price !== 'number' && !(json.price instanceof Number))
    throw new TypeError('Price must be a number.');
  return Asset(json.symbol, $(json.price));
};
export default Asset;
