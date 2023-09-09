import { assert } from 'chai';
import { Option, fromNullable, fromPromise, fromTry } from '../dist/option.js';

describe('Option monad', () => {
  describe('Some object', () => {
    const option = Option.some(42);
    
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
      const newOption = option.chain(n => Option.some(n.toString()));
      assert.equal(newOption.getOrElse('default'), '42');
    });
  });

  describe('The None object', () => {
    it('should return false for a null value', () => {
      assert.isFalse(Option.none.isPresent());
    });

    it('should return the default value when calling getOrElse', () => {
      assert.equal(Option.none.getOrElse(0), 0);
    });

    it('should throw an error when calling getOrThrow', () => {
      assert.throw(() => Option.none.getOrThrow(), 'Option is empty');
    });

    it('should return None when calling map', () => {
      const newOption = Option.none.map(n => n.toString());
      assert.isFalse(newOption.isPresent());
    });   

    it('should return None when calling chain', () => {
      const newOption = Option.none.chain(n => Option.some(n.toString()));
      assert.isFalse(newOption.isPresent());
    });
  })

  describe('fromNullable', () => {
    it('should return a some instance for non-null values', () => {
      assert.deepEqual(fromNullable(42), Option.some(42));
      assert.deepEqual(fromNullable('hello'), Option.some('hello'));
      assert.deepEqual(fromNullable(false), Option.some(false));
    });
  
    it('should return None for null or undefined values', () => {
      assert.deepEqual(fromNullable(null), Option.none);
      assert.deepEqual(fromNullable(undefined), Option.none);
    });
  });

  describe('fromPromise', () => {
    it('should return a Some instance containing the resolved value of the promise', async () => {
      const promise = Promise.resolve('hello');
      const result = await fromPromise(promise);
      assert.deepEqual(result, Option.some('hello'));
    });
  
    it('should return None if the promise rejects', async () => {
      const promise = Promise.reject(new Error('oops'));
      const result = await fromPromise(promise);
      assert.deepEqual(result, Option.none);
    });
  });

  describe('fromTry', () => {
    it('should return a Some instance containing the returned value', () => {
      const result = fromTry(() => 'hello');
      assert.deepEqual(result, Option.some('hello'));
    });
  
    it('should return None if the function throws an error', () => {
      const result = fromTry(() => { throw new Error('oops'); });
      assert.deepEqual(result, Option.none);
    });
  });

  describe('Option.collectPresent', () => {
    it('should return an array of all present values', () => {
      const options = [Option.some(1), Option.none, Option.some(2), Option.none, Option.some(3)];
      const result = Option.collectPresent(options);
      assert.deepEqual(result, [1, 2, 3]);
    });
  });
});
