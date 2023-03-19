import { assert } from 'chai';
import { some, none } from '../dist/option.js';

describe('Option monad', () => {
  describe('Some object', () => {
    const option = some(42);
    
    it('should return true for a non-null value', () => {
      assert.isTrue(option.isPresent());
    });

    it('should return the value when calling get', () => {
      assert.equal(option.get(), 42);
    });

    it('should return the value when calling getOrElse', () => {
      assert.equal(option.getOrElse(0), 42);
    });

    it('should return the value when calling getOrThrow', () => {
      assert.equal(option.getOrThrow(), 42);
    });

    it('should return transformed Some object when calling map', () => {
      const newOption = option.map(n => n.toString());
      assert.equal(newOption.get(), '42');
    });

    it('should return transformed Option object when calling chain', () => {
      const newOption = option.chain(n => some(n.toString()));
      assert.equal(newOption.getOrElse('default'), '42');
    });
  });

  describe('The none object', () => {
    it('should return false for a null value', () => {
      assert.isFalse(none.isPresent());
    });

    it('should return the default value when calling getOrElse', () => {
      assert.equal(none.getOrElse(0), 0);
    });

    it('should throw an error when calling getOrThrow', () => {
      assert.throw(() => none.getOrThrow(), 'Optional is empty');
    });

    it('should return none when calling map', () => {
      const newOption = none.map(n => n.toString());
      assert.isFalse(newOption.isPresent());
    });   

    it('should return none when calling chain', () => {
      const newOption = none.chain(n => some(n.toString()));
      assert.isFalse(newOption.isPresent());
    });
  })
});
