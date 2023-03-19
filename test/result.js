import { assert } from 'chai';
import { fail, success } from '../dist/result.js';

describe('Result monad', () => {
  describe('Success object', () => {
    const result = success(42);

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

    it('should return the value when calling mapErr', () => {
      const newResult = result.mapErr((err) => err.toUpperCase());
      assert.isTrue(newResult.isSuccess());
      assert.equal(newResult.get(), 42);
    });

    it('should return a new Success object when calling chain', () => {
      const newResult = result.chain(n => success(n.toString()));
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
    const result = fail('error message');
    
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
  
    it('should return the error message when calling mapErr', () => {
      const newResult = result.mapErr(err => err.toUpperCase());
      assert.isTrue(newResult.isFail());
      assert.equal(newResult.err(), 'ERROR MESSAGE');
    });
  
    it('should return a Fail object when calling chain', () => {
      const newResult = result.chain(n => success(n.toString()));
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
});

