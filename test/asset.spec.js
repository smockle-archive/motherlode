import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';

describe('Asset', () => {
  describe('#constructor', () => {
    it('throws an error when symbol is not a string', () => {
      assert.throws(Asset.bind(Asset, 1, 1), TypeError);
    });
    it('throws an error when price is not a number or Number', () => {
      assert.throws(Asset.bind(Asset, 'SPY', 'SPY'), TypeError);
    });
    it('creates an asset when price is a number', () => {
      const asset = Asset('SPY', 200);
      assert.strictEqual(asset.symbol, 'SPY');
      assert.typeOf(asset.symbol, 'string');
      assert.strictEqual(asset.price, 200);
      assert.typeOf(asset.price, 'number');
    });
    it('creates an asset when price is a Number', () => {
      const asset = Asset('SPY', new Number(200));
      assert.strictEqual(asset.symbol, 'SPY');
      assert.typeOf(asset.symbol, 'string');
      assert.deepEqual(asset.price, new Number(200));
      assert.instanceOf(asset.price, Number);
    });
  });
});
