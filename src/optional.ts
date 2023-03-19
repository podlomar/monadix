import { Functor } from "./functor.js";

export interface Optional<T> extends Functor<T> {
  map<U>(fn: (value: T) => U): Optional<U>;
  chain<U>(fn: (value: T) => Optional<U>): Optional<U>;
  getOrElse(value: T): T;
  getOrThrow(): T;
  isPresent(): boolean;
}

class Some<T> implements Optional<T> {
  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public map<U>(fn: (value: T) => U): Optional<U> {
    return new Some<U>(fn(this.value));
  }

  public chain<U>(fn: (value: T) => Optional<U>): Optional<U> {
    return fn(this.value);
  }

  public getOrElse(value: T): T {
    return this.value;
  }

  public getOrThrow(): T {
    return this.value;
  }

  isPresent(): true {
    return true;
  }
}

type None = Optional<never>;

export const none: None = new class implements Optional<never> {
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
    throw new Error('Accessing value of a None optional');
  }

  public isPresent(): false {
    return false;
  }
}();

export const some = <T>(value: T): Some<T> => new Some<T>(value);
