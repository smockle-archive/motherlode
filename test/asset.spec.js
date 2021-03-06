import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import USD from '../src/usd'; const $ = USD;

describe('Asset', () => {
  describe('#constructor', () => {
    it('throws an error when symbol is not a string', () => {
      assert.throws(Asset.bind(Asset, 1, $(1)), TypeError);
    });
    it('throws an error when symbol is too short', () => {
      assert.throws(Asset.bind(Asset, '', $(1)), TypeError);
    });
    it('throws an error when price is not in USD', () => {
      assert.throws(Asset.bind(Asset, 'ZVZZT', 'ZVZZT'), TypeError);
    });
    it('throws an error when price is negative or zero', () => {
      assert.throws(Asset.bind(Asset, 'ZVZZT', $(0)), TypeError);
      assert.throws(Asset.bind(Asset, 'ZVZZT', $(-1)), TypeError);
    });
    it('creates an Asset when all inputs are valid', () => {
      const asset = Asset('ZVZZT', $(200));
      assert.strictEqual(asset.symbol, 'ZVZZT');
      assert.typeOf(asset.symbol, 'string');
      assert.deepEqual(asset.price, $(200));
      assert.instanceOf(asset.price, $);
    });
  });
});
