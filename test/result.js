import { assert } from 'chai';
import { Result, fromNullable, fromPromise, fromTry } from '../dist/result.js';

describe('Result monad', () => {
  describe('Success object', () => {
    const result = Result.success(42);

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
      const newResult = result.chain(n => Result.success(n.toString()));
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
    const result = Result.fail('error message');
    
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
      const newResult = result.chain(n => Result.success(n.toString()));
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
      assert.deepEqual(fromNullable(42), Result.success(42));
      assert.deepEqual(fromNullable('hello'), Result.success('hello'));
      assert.deepEqual(fromNullable(false), Result.success(false));
    });
  
    it('should return a fail instance with the specified error for null or undefined values', () => {
      const error = 'Value is null or undefined';
      assert.deepEqual(fromNullable(null, error), Result.fail(error));
      assert.deepEqual(fromNullable(undefined, error), Result.fail(error));
    });
  
    it('should return a null error fail instance for null or undefined values when error is not specified', () => {
      assert.deepEqual(fromNullable(null), Result.fail(null));
      assert.deepEqual(fromNullable(undefined), Result.fail(null));
    });
  });

  describe('fromPromise', () => {
    it('should return a success instance containing the resolved value of the promise', async () => {
      const promise = Promise.resolve('hello');
      const result = await fromPromise(promise);
      assert.deepEqual(result, Result.success('hello'));
    });
  
    it('should return a fail instance containing the rejected error of the promise', async () => {
      const promise = Promise.reject(new Error('oops'));
      const result = await fromPromise(promise);
      assert.deepEqual(result, Result.fail(new Error('oops')));
    });
  });

  describe('fromTry', () => {
    it('should return a success instance containing the returned value', () => {
      const result = fromTry(() => 'hello');
      assert.deepEqual(result, Result.success('hello'));
    });

    it('should return a fail instance containing the thrown error', () => {
      const result = fromTry(() => { throw new Error('oops'); });
      assert.deepEqual(result, Result.fail(new Error('oops')));
    });
  });

  describe('Result.collectSuccess', () => {
    it('should return an array of success instances', () => {
      const results = [
        Result.success(42),
        Result.fail('error message'),
        Result.success('hello'),
        Result.fail('another error message')
      ];
      const filtered = Result.collectSuccess(results);
      assert.deepEqual(filtered, [42, 'hello']);
    });
  });

  describe('Result.collectFail', () => {
    it('should return an array of fail instances', () => {
      const results = [
        Result.success(42),
        Result.fail('error message'),
        Result.success('hello'),
        Result.fail('another error message')
      ];
      const filtered = Result.collectFail(results);
      assert.deepEqual(filtered, ['error message', 'another error message']);
    });
  });

  describe('Result.partition', () => {
    it('should return an object with success and fail instances', () => {
      const results = [
        Result.success(42),
        Result.fail('error message'),
        Result.success('hello'),
        Result.fail('another error message')
      ];
      const { success, fail } = Result.partition(results);
      assert.deepEqual(success, [42, 'hello']);
      assert.deepEqual(fail, ['error message', 'another error message']);
    });
  });
});
