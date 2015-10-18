import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Percent from '../src/percent';
import USD from '../src/usd'; const $ = USD;
import Motherlode from '../src/motherlode';

describe('Motherlode', () => {
  it('throws if input is not an Array', () => {
    assert.throws(Motherlode.bind(Motherlode, 'SPY'), TypeError);
  });
  it('throws if input Array is empty', () => {
    assert.throws(Motherlode.bind(Motherlode, []), Error);
  });
  it('throws if input Array contains an element without a required key', () => {
    const unallocated = [{
      asset: Asset('SPY', $(200)),
      quantity: 1,
      ideal: Percent(100)
    }];
    const assetless = Object.assign(unallocated); delete assetless[0].asset;
    const quantityless = Object.assign(unallocated); delete quantityless[0].quantity;
    const idealless = Object.assign(unallocated); delete idealless[0].ideal;
    assert.throws(Motherlode.bind(Motherlode, [assetless]), TypeError);
    assert.throws(Motherlode.bind(Motherlode, [quantityless]), TypeError);
    assert.throws(Motherlode.bind(Motherlode, [idealless]), TypeError);
  });
  it('throws if input Array contains an element with a value of the wrong type', () => {
    const unallocated = [{
      asset: Asset('SPY', $(200)),
      quantity: 1,
      ideal: Percent(100)
    }];
    let notasset = Object.assign(unallocated); notasset[0].asset = 'SPY';
    let notquantity = Object.assign(unallocated); notquantity[0].quantity = '1';
    let notideal = Object.assign(unallocated); notideal[0].ideal = '100%';
    assert.throws(Motherlode.bind(Motherlode, [notasset]), TypeError);
    assert.throws(Motherlode.bind(Motherlode, [notquantity]), TypeError);
    assert.throws(Motherlode.bind(Motherlode, [notideal]), TypeError);
  });
  it('throws if input Array contains an element has a negative quantity', () => {
    const negative = [{
      asset: Asset('SPY', $(200)),
      quantity: -1,
      ideal: Percent(100)
    }];
    assert.throws(Motherlode.bind(Motherlode, [negative]), TypeError);
  });
  it('returns array of assets', () => {
    const unallocated = [{
      asset: Asset('SPY', $(200)),
      quantity: 1,
      ideal: Percent(100)
    }];
    const allocated = Motherlode(unallocated);
    assert.deepEqual(allocated, unallocated);
  });
});
