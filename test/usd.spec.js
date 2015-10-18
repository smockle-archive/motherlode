import 'mocha';
import {assert} from 'chai';
import util from 'util';
import USD from '../src/usd'; const $ = USD;

describe('USD', () => {
  describe('#constructor', () => {
    it('throws an error when input is not number or Number', () => {
      assert.throws($.bind($, '50'), TypeError);
    });
    it('creates a USD when input is a number', () => {
      assert.doesNotThrow($.bind($, 50), TypeError);
      const usd = $(50);
      assert.typeOf(usd.__value, 'number');
      assert.strictEqual(usd.__value, 50);
    });
    it('creates a USD when input is a Number', () => {
      assert.doesNotThrow($.bind($, new Number(50)), TypeError);
      const usd = $(new Number(50));
      assert.instanceOf(usd.__value, Number);
      assert.deepEqual(usd.__value, new Number(50));
    });
  });
  describe('#inspect', () => {
    it('prints a positive dollar value', () => {
      assert.strictEqual(util.inspect($(50)), '$50');
    });
    it('prints a negative dollar value', () => {
      assert.strictEqual(util.inspect($(-50)), '-$50');
    });
    it('prints zero usd', () => {
      assert.strictEqual(util.inspect($(0)), '$0');
    });
    it('supports decimal dollar values', () => {
      assert.strictEqual(util.inspect($(0.5)), '$0.5');
      assert.strictEqual(util.inspect($(50.5)), '$50.5');
    });
  });
  describe('#valueOf', () => {
    it('evaluates to a positive float', () => {
      assert.typeOf($(50).valueOf(), 'number');
      assert.strictEqual($(50).valueOf(), 50);
    });
    it('evaluates to a negative float', () => {
      assert.typeOf($(-50).valueOf(), 'number');
      assert.strictEqual($(-50).valueOf(), -50);
    });
    it('evaluates to zero', () => {
      assert.typeOf($(0).valueOf(), 'number');
      assert.strictEqual($(0).valueOf(), 0);
    });
    it('supports decimal dollar values', () => {
      assert.typeOf($(0.5).valueOf(), 'number');
      assert.strictEqual($(0.5).valueOf(), 0.5);
      assert.typeOf($(50.5).valueOf(), 'number');
      assert.strictEqual($(50.5).valueOf(), 50.5);
    });
  });
});
