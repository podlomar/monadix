import { assert } from 'chai';
import { Success, Fail, fromNullable, fromPromise, fromTry } from '../dist/result.js';

describe('Result monad', () => {
  describe('Success object', () => {
    const result = Success.of(42);

    it('should create a Success object', () => {  
      assert.isTrue(result.isSuccess());
      assert.isFalse(result.isFail());
    });

    it('should return the value when calling get', () => {
      assert.equal(result.get(), 42);
    });

    it('should return the value when calling getOrElse', () => {
      assert.equal(result.getOrElse(0), 42);
    });

    it('should return the value when calling getOrThrow', () => {
      assert.equal(result.getOrThrow(), 42);
    });

    it('should return the value when calling map', () => {
      const newResult = result.map((n) => n.toString());
      assert.isTrue(newResult.isSuccess());
      assert.equal(newResult.getOrElse(), '42');
    });

    it('should return the value when calling orElse', () => {
      const newResult = result.orElse((err) => err.toUpperCase());
      assert.isTrue(newResult.isSuccess());
      assert.equal(newResult.get(), 42);
    });

    it('should return a new Success object when calling chain', () => {
      const newResult = result.chain(n => Success.of(n.toString()));
      assert.isTrue(newResult.isSuccess());
      assert.equal(newResult.get(), '42');
    });

    it('should call the success function when calling match', () => {
      const value = result.match({
        success: (n) => `The value is ${n}`,
        fail: (err) => `There was an error: ${err}`
      });
      assert.equal(value, 'The value is 42');
    });
  });

  describe('Fail object', () => {  
    const result = Fail.of('error message');
    
    it('should create a Fail object', () => {
      assert.isFalse(result.isSuccess());
      assert.isTrue(result.isFail());
    });
  
    it('should return the error when calling err', () => {
      assert.equal(result.err(), 'error message');
    });

    it('should return the default value when calling getOrElse', () => {
      assert.equal(result.getOrElse(0), 0);
    });
  
    it('should throw an error when calling getOrThrow', () => {
      assert.throws(() => {
        result.getOrThrow();
      }, 'error message');
    });
  
    it('should return a Fail object when calling map', () => {
      const newResult = result.map(n => n.toString());
      assert.isTrue(newResult.isFail());
      assert.equal(newResult.err(), 'error message');
    });
  
    it('should return the error message when calling orElse', () => {
      const newResult = result.orElse(err => err.toUpperCase());
      assert.isTrue(newResult.isFail());
      assert.equal(newResult.err(), 'ERROR MESSAGE');
    });
  
    it('should return a Fail object when calling chain', () => {
      const newResult = result.chain(n => Success.of(n.toString()));
      assert.isTrue(newResult.isFail());
      assert.equal(newResult.err(), 'error message');
    });

    it('should call the fail function when calling match', () => {
      const value = result.match({
        success: n => `The value is ${n}`,
        fail: err => `There was an error: ${err}`
      });
      assert.equal(value, 'There was an error: error message');
    });
  });

  describe('fromNullable', () => {
    it('should return a success instance for non-null values', () => {
      assert.deepEqual(fromNullable(42), Success.of(42));
      assert.deepEqual(fromNullable('hello'), Success.of('hello'));
      assert.deepEqual(fromNullable(false), Success.of(false));
    });
  
    it('should return a fail instance with the specified error for null or undefined values', () => {
      const error = 'Value is null or undefined';
      assert.deepEqual(fromNullable(null, error), Fail.of(error));
      assert.deepEqual(fromNullable(undefined, error), Fail.of(error));
    });
  
    it('should return a null error fail instance for null or undefined values when error is not specified', () => {
      assert.deepEqual(fromNullable(null), Fail.of(null));
      assert.deepEqual(fromNullable(undefined), Fail.of(null));
    });
  });

  describe('fromPromise', () => {
    it('should return a success instance containing the resolved value of the promise', async () => {
      const promise = Promise.resolve('hello');
      const result = await fromPromise(promise);
      assert.deepEqual(result, Success.of('hello'));
    });
  
    it('should return a fail instance containing the rejected error of the promise', async () => {
      const promise = Promise.reject(new Error('oops'));
      const result = await fromPromise(promise);
      assert.deepEqual(result, Fail.of(new Error('oops')));
    });
  });

  describe('fromTry', () => {
    it('should return a success instance containing the returned value', () => {
      const result = fromTry(() => 'hello');
      assert.deepEqual(result, Success.of('hello'));
    });

    it('should return a fail instance containing the thrown error', () => {
      const result = fromTry(() => { throw new Error('oops'); });
      assert.deepEqual(result, Fail.of(new Error('oops')));
    });
  });
});
