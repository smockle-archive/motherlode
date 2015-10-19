import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Percent from '../src/percent';
import USD from '../src/usd'; const $ = USD;
import Portfolio from '../src/portfolio';
import Immutable from '../src/immutable';

describe('Portfolio', () => {
  describe('#constructor', () => {
    it('throws if input is not an Array', () => {
      assert.throws(Portfolio.bind(Portfolio, 'ZVZZT'), TypeError);
    });

    it('throws if input Array is empty', () => {
      assert.throws(Portfolio.bind(Portfolio, []), Error);
    });

    it('throws if input Array contains an element without an asset', () => {
      const assets = Immutable([{
        quantity: 1,
        ideal: Percent(100)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element without a quantity', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        ideal: Percent(100)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element without an ideal allocation', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element with an asset of the wrong type', () => {
      const assets = Immutable([{
        asset: 'ZVZZT',
        quantity: 1,
        ideal: Percent(100)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element with a quantity of the wrong type', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: '1',
        ideal: Percent(100)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element with an ideal allocation of the wrong type', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: '100%'
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if input Array contains an element has a negative quantity', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: -1,
        ideal: Percent(100)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if ideal allocations sum to less than 100%', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(50)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('throws if ideal allocations sum to more than 100%', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(150)
      }]);
      assert.throws(Portfolio.bind(Portfolio, assets), TypeError);
    });

    it('creates a Portfolio when all inputs are valid', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      const portfolio = Portfolio(assets);
      // Check portfolio
      assert.instanceOf(portfolio, Portfolio);
      assert.deepEqual($(200), $(portfolio.net));
      // Check ZVZZT
      assert.deepEqual(assets[0].asset, portfolio.assets[0].asset);
      assert.strictEqual(assets[0].quantity, portfolio.assets[0].quantity);
      assert.deepEqual(assets[0].ideal, portfolio.assets[0].ideal);
    });

    it('does not mutate input', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      const konst = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      Portfolio(assets);
      assert.deepEqual(assets, konst);
    });
  });
  describe('#load', () => {
    it('throws if input is not in USD', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      let portfolio = Portfolio(assets);
      assert.throws(portfolio.load.bind(portfolio, 'ZVZZT'), TypeError);
    });

    it('loads additional funds without cash surplus', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      let portfolio = Portfolio(assets);
      portfolio.load($(200));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(400));
      assert.strictEqual(portfolio.assets.length, 1);
      // Check ZVZZT
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
    });

    it('loads additional funds with cash surplus', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      let portfolio = Portfolio(assets);
      portfolio.load($(250));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(450));
      assert.strictEqual(portfolio.assets.length, 2);
      // Check ZVZZT
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 50);
    });

    it('loads cash surplus', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }]);
      let portfolio = Portfolio(assets);
      portfolio.load($(50));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(250));
      assert.strictEqual(portfolio.assets.length, 2);
      // Check ZVZZT
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 50);
    });

    it('loads cash surplus if load amount is less than the price of the selected underallocated asset', () => {
      const assets = Immutable([{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(50)
      }, {
        asset: Asset('ZZZZQ', $(50)),
        quantity: 8,
        ideal: Percent(50)
      }]);
      let portfolio = Portfolio(assets);
      portfolio.load($(100));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(700));
      assert.strictEqual(portfolio.assets.length, 3);
      // Check ZVZZT
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check ZZZZQ
      const zzzzq = portfolio.assets.find((a) => a.asset.symbol === 'ZZZZQ');
      assert.strictEqual(zzzzq.quantity, 8);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 100);
    });
  });
});
