import { Monad } from "./base-types.js";

export interface Option<T> extends Monad<T> {
  getOrElse(value: T): T;
  getOrThrow(): T;
  isPresent(): this is Some<T>;
}

class Some<T> implements Option<T> {
  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public map<U>(fn: (value: T) => U): Some<U> {
    return new Some<U>(fn(this.value));
  }

  public chain<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  public getOrElse(value: T): T {
    return this.value;
  }

  public getOrThrow(): T {
    return this.value;
  }

  public isPresent(): true {
    return true;
  }

  public get(): T {
    return this.value;
  }
}

type None = Option<never>;

export const none: None = new class implements Option<never> {
  public constructor() {}

  public map<U>(): this {
    return this;
  }

  public chain<U>(): this {
    return this;
  }

  public getOrElse<T>(value: T): T {
    return value;
  }

  public getOrThrow(): never {
    throw new Error('Optional is empty');
  }

  public isPresent(): false {
    return false;
  }
}();

export const some = <T>(value: T): Some<T> => new Some<T>(value);

export const fromNullable = <T>(
  value: T | null | undefined
): Option<T> => (value === null || value === undefined) ? none : some(value);

export const fromPromise = <T>(
  promise: Promise<T>
): Promise<Option<T>> => promise.then(some).catch(() => none);
