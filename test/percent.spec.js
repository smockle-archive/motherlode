import 'mocha';
import {assert} from 'chai';
import util from 'util';
import Percent from '../src/percent';

describe('Percent', () => {
  describe('#constructor', () => {
    it('throws an error when input is not number or Number', () => {
      assert.throws(Percent.bind(Percent, '50'), TypeError);
    });
    it('creates a Percent when input is a number', () => {
      assert.doesNotThrow(Percent.bind(Percent, 50), TypeError);
      const percent = Percent(50);
      assert.typeOf(percent.__value, 'number');
      assert.strictEqual(percent.__value, 50);
    });
    it('creates a Percent when input is a Number', () => {
      assert.doesNotThrow(Percent.bind(Percent, new Number(50)), TypeError);
      const percent = Percent(new Number(50));
      assert.instanceOf(percent.__value, Number);
      assert.deepEqual(percent.__value, new Number(50));
    });
  });
  describe('#fromDecimal', () => {
    it('throws an error when input is not number or Number', () => {
      assert.throws(Percent.fromDecimal.bind(Percent, '50'), TypeError);
    });
    it('creates a Percent when input is a number', () => {
      assert.doesNotThrow(Percent.fromDecimal.bind(Percent, 0.5), TypeError);
      const percent = Percent.fromDecimal(0.5);
      assert.typeOf(percent.__value, 'number');
      assert.strictEqual(percent.__value, 50);
    });
    it('creates a Percent when input is a Number', () => {
      assert.doesNotThrow(Percent.fromDecimal.bind(Percent, new Number(0.5)), TypeError);
      const percent = Percent.fromDecimal(new Number(0.5));
      assert.typeOf(percent.__value, 'number');
      assert.strictEqual(percent.__value, 50);
    });
  });
  describe('#inspect', () => {
    it('prints a positive percentage', () => {
      assert.strictEqual(util.inspect(Percent(50)), '50%');
    });
    it('prints a negative percentage', () => {
      assert.strictEqual(util.inspect(Percent(-50)), '-50%');
    });
    it('prints zero percent', () => {
      assert.strictEqual(util.inspect(Percent(0)), '0%');
    });
    it('supports decimal percents', () => {
      assert.strictEqual(util.inspect(Percent(0.5)), '0.5%');
      assert.strictEqual(util.inspect(Percent(50.5)), '50.5%');
    });
  });
  describe('#valueOf', () => {
    it('evaluates to a positive float', () => {
      assert.typeOf(Percent(50).valueOf(), 'number');
      assert.strictEqual(Percent(50).valueOf(), 0.5);
    });
    it('evaluates to a negative float', () => {
      assert.typeOf(Percent(-50).valueOf(), 'number');
      assert.strictEqual(Percent(-50).valueOf(), -.5);
    });
    it('evaluates to zero', () => {
      assert.typeOf(Percent(0).valueOf(), 'number');
      assert.strictEqual(Percent(0).valueOf(), 0);
    });
    it('supports decimal percents', () => {
      assert.typeOf(Percent(0.5).valueOf(), 'number');
      assert.strictEqual(Percent(0.5).valueOf(), .005);
      assert.typeOf(Percent(50.5).valueOf(), 'number');
      assert.strictEqual(Percent(50.5).valueOf(), .505);
    });
  });
});
