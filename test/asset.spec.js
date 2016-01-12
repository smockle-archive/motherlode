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
  describe('#serialize', () => {
    it('returns a JSON representation of an asset', () => {
      const asset = Asset('ZVZZT', $(200));
      const json = asset.serialize();
      const parsed = JSON.parse(json);
      assert.strictEqual(json, '{"symbol":"ZVZZT","price":200}');
      assert.ok(parsed.hasOwnProperty('symbol'));
      assert.ok(parsed.hasOwnProperty('price'));
      assert.strictEqual(parsed.symbol, 'ZVZZT');
      assert.strictEqual(parsed.price, 200);
    });
  });
  describe('#deserialize', () => {
    it('returns a parsed asset', () => {
      const json = '{"symbol":"ZVZZT","price":200}';
      const parsed = JSON.parse(json);
      const asset = Asset.deserialize(parsed);
      assert.strictEqual(asset.symbol, 'ZVZZT');
      assert.typeOf(asset.symbol, 'string');
      assert.deepEqual(asset.price, $(200));
      assert.instanceOf(asset.price, $);
    });
  });
});
