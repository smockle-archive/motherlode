import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Percent from '../src/percent';
import USD from '../src/usd'; const $ = USD;
import Portfolio from '../src/portfolio';

describe('Portfolio', () => {
  describe('#constructor', () => {
    it('throws if input is not an Array', () => {
      assert.throws(Portfolio.bind(Portfolio, 'ZVZZT'), TypeError);
    });
    it('throws if input Array is empty', () => {
      assert.throws(Portfolio.bind(Portfolio, []), Error);
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
      assert.throws(Portfolio.bind(Portfolio, [assetless]), TypeError);
      assert.throws(Portfolio.bind(Portfolio, [quantityless]), TypeError);
      assert.throws(Portfolio.bind(Portfolio, [idealless]), TypeError);
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
      assert.throws(Portfolio.bind(Portfolio, [notasset]), TypeError);
      assert.throws(Portfolio.bind(Portfolio, [notquantity]), TypeError);
      assert.throws(Portfolio.bind(Portfolio, [notideal]), TypeError);
    });
    it('throws if input Array contains an element has a negative quantity', () => {
      const negative = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: -1,
        ideal: Percent(100)
      }];
      assert.throws(Portfolio.bind(Portfolio, [negative]), TypeError);
    });
    it('throws if ideal allocations don’t sum to 100%', () => {
      const under = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(50)
      }];
      let over = Object.assign(under); over.ideal = Percent(150);
      assert.throws(Portfolio.bind(Portfolio, [under]), TypeError);
      assert.throws(Portfolio.bind(Portfolio, [over]), TypeError);
    });
    it('creates a Portfolio when all inputs are valid', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      const portfolio = Portfolio(assets);
      assert.instanceOf(portfolio, Portfolio);
      assert.deepEqual($(200), $(portfolio.net));
      assert.deepEqual(assets[0].asset, portfolio.assets[0].asset);
      assert.strictEqual(assets[0].quantity, portfolio.assets[0].quantity);
      assert.deepEqual(assets[0].ideal, portfolio.assets[0].ideal);
    });
    it('does not mutate input', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      const konst = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      Portfolio(assets);
      assert.deepEqual(assets, konst);
    });
  });
  describe('#load', () => {
    it('throws if input is not in USD', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let portfolio = Portfolio(assets);
      assert.throws(portfolio.load.bind(portfolio, 'ZVZZT'), TypeError);
    });
    it('loads additional funds without cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let portfolio = Portfolio(assets);
      portfolio.load($(200));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(400));
      assert.strictEqual(portfolio.assets.length, 1);
      // Check SPY
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
    });
    it('loads additional funds with cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let portfolio = Portfolio(assets);
      portfolio.load($(250));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(450));
      assert.strictEqual(portfolio.assets.length, 2);
      // Check SPY
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 2);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 50);
    });
    it('loads cash surplus', () => {
      const assets = [{
        asset: Asset('ZVZZT', $(200)),
        quantity: 1,
        ideal: Percent(100)
      }];
      let portfolio = Portfolio(assets);
      portfolio.load($(50));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(250));
      assert.strictEqual(portfolio.assets.length, 2);
      // Check SPY
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
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
      let portfolio = Portfolio(assets);
      portfolio.load($(100));
      // Check portfolio
      assert.deepEqual(portfolio.net, $(700));
      assert.strictEqual(portfolio.assets.length, 3);
      // Check SPY
      const zvzzt = portfolio.assets.find((a) => a.asset.symbol === 'ZVZZT');
      assert.strictEqual(zvzzt.quantity, 1);
      // Check AGG
      const zzzzq = portfolio.assets.find((a) => a.asset.symbol === 'ZZZZQ');
      assert.strictEqual(zzzzq.quantity, 8);
      // Check CASH
      const cash = portfolio.assets.find((a) => a.asset.symbol === '_CASH');
      assert.deepEqual(cash.asset.price, $(1));
      assert.strictEqual(cash.quantity, 100);
    });
  });
});
