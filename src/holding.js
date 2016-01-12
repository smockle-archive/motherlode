import USD from './usd'; const $ = USD;

function Holding(asset, quantity, ideal) {
  let holding = Object.create(Holding.prototype);
  // TODO: Validate parameters
  // Assign properties
  asset.asset = asset;
  asset.quantity = quantity;
  asset.ideal = ideal;
  return holding;
}
Holding.prototype.serialize = () => ({
  asset: this.asset.toJSON(),
  quantity: this.quantity,
  ideal: this.ideal
});
Holding.deserialize = json => {
  if (!json.hasOwnProperty('asset'))
    throw new TypeError('An asset key must be provided.');
  if (!json.asset.hasOwnProperty('symbol'))
    throw new TypeError('Provided asset object must include a symbol key.');
  if (!json.asset.hasOwnProperty('price'))
    throw new TypeError('Provided asset object must include a price key.');
  if (!json.hasOwnProperty('quantity'))
    throw new TypeError('A quantity key must be provided.');
  if (!json.hasOwnProperty('ideal'))
    throw new TypeError('An ideal key must be provided.');
  if (typeof json.asset.price !== 'number' && !(json.asset.price instanceof Number))
    throw new TypeError('Price must be a number.');
  if (typeof json.quantity !== 'number' && !(json.quantity instanceof Number))
    throw new TypeError('Quantity must be a number.');
  if (typeof json.ideal !== 'number' && !(json.ideal instanceof Number))
    throw new TypeError('Ideal allocation must be a number.');
  if (json.quantity < 0)
    throw new TypeError('Quantity cannot be negative.');
  if (json.ideal > 100)
    throw new TypeError('Ideal allocation cannot exceed 100.');
  return {
    asset: Asset(json.asset.symbol, $(json.asset.price)),
    quantity: json.quantity,
    ideal: Percent(json.ideal)
  };
};
export default Holding;
