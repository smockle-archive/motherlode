import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Percent from '../src/percent';
import Motherlode from '../src/motherlode';

describe('Motherlode', () => {
  it('throws if input is not an Array', () => {
    assert.throws(Motherlode.bind(Motherlode, 'SPY'), TypeError);
  });
  it('throws if input Array is empty', () => {
    assert.throws(Motherlode.bind(Motherlode, []), Error);
  });
  it('returns array of assets', () => {
    const unallocated = [{
      asset: Asset('SPY', 200),
      quantity: 1,
      ideal: Percent(100)
    }];
    const allocated = Motherlode(unallocated);
    assert.deepEqual(allocated, unallocated);
  });
});
