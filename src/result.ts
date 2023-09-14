import { Monad } from "./base-types.js";

// ap<U, F>(fn: Result<(value: T) => U, F>): Result<U, E | F>;

interface BaseResult<T, E> extends Monad<T> {
  map<U>(fn: (value: T) => U): Result<U, E>;
  orElse<F>(fn: (err: E) => F): Result<T, F>;
  chain<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
  match<U>(m: { success: (succ: T) => U; fail: (err: E) => U }): U;
  isSuccess(): this is Success<T>;
  isFail(): this is Fail<E>;
  getOrElse<D>(value: D): T | D;
  getOrThrow(): T;
}

export class Success<T> implements BaseResult<T, never> {
  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public map<U>(fn: (value: T) => U): Success<U> {
    return new Success(fn(this.value));
  }

  public orElse(): this {
    return this;
  }

  public chain<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }
  
  public match<U>({ success }: { success: (succ: T) => U, fail: unknown }): U {
    return success(this.value);
  }

  public isSuccess(): this is Success<T> {
    return true;
  }
  
  public isFail(): false {
    return false;
  }
  
  public getOrElse(): T {
    return this.value;
  }

  public getOrThrow(): T {
    return this.value;
  }

  public get(): T {
    return this.value;
  }
};

export class Fail<E> implements BaseResult<never, E> {
  private readonly error: E;

  public constructor(error: E) {
    this.error = error;
  }

  public map(): this {
    return this;
  }

  public orElse<F>(fn: (err: E) => F): Fail<F> {
    return new Fail(fn(this.error));
  }

  public chain(): this {
    return this;
  }
  
  public match<U>({ fail }: { success: unknown; fail: (err: E) => U }): U {
    return fail(this.error);
  }

  public isSuccess(): false {
    return false;
  }
  
  public isFail(): this is Fail<E> {
    return true;
  }
  
  public getOrElse<D>(value: D): D {
    return value;
  }

  public getOrThrow(): never {
    throw this.error;
  }

  public err(): E {
    return this.error;
  }
};

export type Result<T, E> = Success<T> | Fail<E>;

interface FromNullable {
  <T>(value: T | null | undefined): Result<T, null>;
  <T, E>(value: T | null | undefined, error: E): Result<T, E>;
}

export const fromNullable: FromNullable = <T, E>(
  value: T | null | undefined, error: E | null = null,
): Result<T, E | null> => (
  (value === null || value === undefined) ? Result.fail(error) : Result.success(value)
);

export const fromPromise = <T>(
  promise: Promise<T>
): Promise<Result<T, unknown>> => promise.then(Result.success).catch((error) => Result.fail(error));

export const fromTry = <T>(fn: () => T): Result<T, unknown> => {
  try {
    return Result.success(fn());
  } catch (error) {
    return Result.fail(error);
  }
}

export type ResultsPartition<T, E> = {
  success: T[];
  fail: E[];
}

interface ResultBuilder {
  success<T>(value: T): Success<T>;
  fail<E>(error: E): Fail<E>;
  collectSuccess<T, E>(results: Result<T, E>[]): T[];
  collectFail<T, E>(results: Result<T, E>[]): E[];
  partition<T, E>(results: Result<T, E>[]): ResultsPartition<T, E>;
}

export const Result: ResultBuilder = {
  success: <T>(value: T): Success<T> => new Success(value),
  fail: <E>(error: E): Fail<E> => new Fail(error),
  collectSuccess: <T, E>(results: Result<T, E>[]): T[] => results
    .filter((result): result is Success<T> => result.isSuccess())
    .map((result) => result.get()),
  collectFail: <T, E>(results: Result<T, E>[]): E[] => results
    .filter((result): result is Fail<E> => result.isFail())
    .map((result) => result.err()),
  partition: <T, E>(results: Result<T, E>[]): ResultsPartition<T, E> => {
    const partition = { success: [], fail: [] } as ResultsPartition<T, E>;
    for (const result of results) {
      if (result.isSuccess()) {
        partition.success.push(result.get());
      } else {
        partition.fail.push(result.err());
      }
    }

    return partition;
  },
}
