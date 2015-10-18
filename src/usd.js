function USD(number) {
  let usd = Object.create(USD.prototype);
  // Validate parameters
  if (typeof number !== 'number' && !(number instanceof Number))
    throw new TypeError('Expected input to be a number.');
  // Set properties
  usd.__value = number;
  return usd;
}
USD.prototype.inspect = function() {
  return `\$${this.__value}`.replace('$-', '-$');
};
USD.prototype.valueOf = function() {
  return this.__value;
};
export default USD;
