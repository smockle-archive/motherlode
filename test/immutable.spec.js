import 'mocha';
import {assert} from 'chai';
import Immutable from '../src/immutable';

describe('Immutable', () => {
  it('freezes each item in an array', () => {
    const array = Immutable([ 1, new Number(2), 'three', () => 4 ]);
    array.forEach(x => assert.isTrue(Object.isFrozen(x)));
  });
  it('freezes each item in a nested array', () => {
    const array = Immutable([[ 1, new Number(2), 'three', () => 4 ]]);
    array.forEach(x => {
      x.forEach(y => assert.isTrue(Object.isFrozen(y)));
    });
  });
  it('freezes each key in an object', () => {
    const object = Immutable({
      a: 1,
      b: new Number(2),
      c: 'three',
      d: () => 4
    });
    assert.isTrue(Object.isFrozen(object.a));
    assert.isTrue(Object.isFrozen(object.b));
    assert.isTrue(Object.isFrozen(object.c));
    assert.isTrue(Object.isFrozen(object.d));
  });
  it('freezes each key in a nested object', () => {
    const object = Immutable({
      o: {
        a: 1,
        b: new Number(2),
        c: 'three',
        d: () => 4
      }
    });
    assert.isTrue(Object.isFrozen(object.o.a));
    assert.isTrue(Object.isFrozen(object.o.b));
    assert.isTrue(Object.isFrozen(object.o.c));
    assert.isTrue(Object.isFrozen(object.o.d));
  });
})
