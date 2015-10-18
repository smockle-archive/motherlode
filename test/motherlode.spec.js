import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Percent from '../src/percent';
import USD from '../src/usd'; const $ = USD;
import Motherlode from '../src/motherlode';

describe('Motherlode', () => {
  describe('#constructor', () => {
    it('throws if input is not an Array', () => {
      assert.throws(Motherlode.bind(Motherlode, 'ZVZZT'), TypeError);
    });
    it('throws if input Array is empty', () => {
      assert.throws(Motherlode.bind(Motherlode, []), Error);
    });
    it('throws if input Array contains an element without a required key', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      const assetless = Object.assign(assets); delete assetless[0].asset;
      const quantityless = Object.assign(assets); delete quantityless[0].quantity;
      const idealless = Object.assign(assets); delete idealless[0].ideal;
      assert.throws(Motherlode.bind(Motherlode, [assetless]), TypeError);
      assert.throws(Motherlode.bind(Motherlode, [quantityless]), TypeError);
      assert.throws(Motherlode.bind(Motherlode, [idealless]), TypeError);
    });
    it('throws if input Array contains an element with a value of the wrong type', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let notasset = Object.assign(assets); notasset[0].asset = 'ZVZZT';
      let notquantity = Object.assign(assets); notquantity[0].quantity = '1';
      let notideal = Object.assign(assets); notideal[0].ideal = '100%';
      assert.throws(Motherlode.bind(Motherlode, [notasset]), TypeError);
      assert.throws(Motherlode.bind(Motherlode, [notquantity]), TypeError);
      assert.throws(Motherlode.bind(Motherlode, [notideal]), TypeError);
    });
    it('throws if input Array contains an element has a negative quantity', () => {
      const negative = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: -1,
        ideal: Percent(100)
      }];
      assert.throws(Motherlode.bind(Motherlode, [negative]), TypeError);
    });
    it('creates a Motherlode when all inputs are valid', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      const motherlode = Motherlode(assets);
      assert.instanceOf(motherlode, Motherlode);
      assert.deepEqual($(200), $(motherlode.net));
      assert.deepEqual(assets[0].asset, motherlode.assets[0].asset);
      assert.strictEqual(assets[0].quantity, motherlode.assets[0].quantity);
      assert.deepEqual(assets[0].ideal, motherlode.assets[0].ideal);
    });
  });
  describe('#load', () => {
    it('throws if input is not in USD', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let motherlode = Motherlode(assets);
      assert.throws(motherlode.load.bind(motherlode, 'ZVZZT'), TypeError);
    });
    it('loads additional funds without cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let motherlode = Motherlode(assets);
      motherlode.load($(200));
      // Check portfolio
      assert.deepEqual(motherlode.net, $(400));
      assert.strictEqual(motherlode.assets.length, 1);
      // Check SPY
      const zvzzt = motherlode.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
    });
    it('loads additional funds with cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let motherlode = Motherlode(assets);
      motherlode.load($(250));
      // Check portfolio
      assert.deepEqual(motherlode.net, $(450));
      assert.strictEqual(motherlode.assets.length, 2);
      // Check SPY
      const zvzzt = motherlode.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
      // Check CASH
      const cash = motherlode.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 50);
    });
    it('loads cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let motherlode = Motherlode(assets);
      motherlode.load($(50));
      // Check portfolio
      assert.deepEqual(motherlode.net, $(250));
      assert.strictEqual(motherlode.assets.length, 2);
      // Check SPY
      const zvzzt = motherlode.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check CASH
      const cash = motherlode.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 50);
    });
    it('loads cash surplus if load amount is greater than the price of the cheapest asset but less than the price of the most underallocated asset', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(50)
      }, {
        asset: Asset('ZZZZQ', $(50)),
        quantity: 8,
        ideal: Percent(50)
      }];
      let motherlode = Motherlode(assets);
      motherlode.load($(100));
      // Check portfolio
      assert.deepEqual(motherlode.net, $(700));
      assert.strictEqual(motherlode.assets.length, 3);
      // Check SPY
      const zvzzt = motherlode.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check AGG
      const zzzzq = motherlode.assets.find((a) => a.asset.symbol === 'ZZZZQ');
      assert.strictEqual(zzzzq.quantity, 8);
      // Check CASH
      const cash = motherlode.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 100);
    });
  });
});
