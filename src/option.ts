import { Monad } from "./base-types.js";

interface BaseOption<T> extends Monad<T> {
  isPresent(): this is Some<T>;
  map<U>(fn: (value: T) => U): Option<U>;
  chain<U, F>(fn: (value: T) => Option<U>): Option<U>;
  getOrElse(value: T): T;
  getOrThrow(): T;
}

export class Some<T> implements BaseOption<T> {
  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public static of<T>(value: T): Some<T> {
    return new Some(value);
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

type None = BaseOption<never>;

export const None: None = new class implements BaseOption<never> {
  public constructor() {}

  public map(): this {
    return this;
  }

  public chain(): this {
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

export type Option<T> = Some<T> | None;

export const fromNullable = <T>(
  value: T | null | undefined
): Option<T> => (value === null || value === undefined) ? None : Some.of(value);

export const fromPromise = <T>(
  promise: Promise<T>
): Promise<Option<T>> => promise.then(Some.of).catch(() => None);

export const fromTry = <T>(fn: () => T): Option<T> => {
  try {
    return Some.of(fn());
  } catch {
    return None;
  }
};
