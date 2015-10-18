function Percent(number) {
  let percent = Object.create(Percent.prototype);
  // Validate parameters
  if (typeof number !== 'number' && !(number instanceof Number))
    throw new TypeError('Expected input to be a number.');
  // Set properties
  percent.__value = number;
  return percent;
}
Percent.fromDecimal = function(number) {
  // Validate parameters
  if (typeof number !== 'number' && !(number instanceof Number))
    throw new TypeError('Expected input to be a number.');
  return Percent(100 * number);
};
Percent.prototype.inspect = function() {
  return `${this.__value}%`;
}
Percent.prototype.valueOf = function() {
  return this.__value/100;
}
export default Percent;
