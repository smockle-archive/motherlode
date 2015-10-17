import 'mocha';
import {assert} from 'chai';
import Asset from '../src/asset';
import Motherlode from '../src/motherlode';

describe('Motherlode', () => {
  it('returns input', () => {
    const unallocated = [{
      asset: Asset('VTI', 200),
      quantity: 1,
      ideal: '100%'
    }];
    const allocated = Motherlode(unallocated);
    assert.deepEqual(allocated, unallocated);
  });
});
