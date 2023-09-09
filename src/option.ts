import { Monad } from "./base-types.js";

interface BaseOption<T> extends Monad<T> {
  isPresent(): this is Some<T>;
  map<U>(fn: (value: T) => U): Option<U>;
  chain<U, F>(fn: (value: T) => Option<U>): Option<U>;
  getOrElse<D>(value: D): T | D;
  getOrThrow(): T;
}

export class Some<T> implements BaseOption<T> {
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

  public getOrElse(): T {
    return this.value;
  }

  public getOrThrow(): T {
    return this.value;
  }

  public isPresent(): this is Some<T> {
    return true;
  }

  public get(): T {
    return this.value;
  }
}

export class None implements BaseOption<never> {
  public static readonly value: None = new None();
  
  private constructor() {}

  public map(): this {
    return this;
  }

  public chain(): this {
    return this;
  }

  public getOrElse<D>(value: D): D {
    return value;
  }

  public getOrThrow(): never {
    throw new Error('Option is empty');
  }

  public isPresent(): false {
    return false;
  }
};

export type Option<T> = Some<T> | None;

export const fromNullable = <T>(
  value: T | null | undefined
): Option<T> => (value === null || value === undefined) ? Option.none : Option.some(value);

export const fromPromise = <T>(
  promise: Promise<T>
): Promise<Option<T>> => promise.then(Option.some).catch(() => Option.none);

export const fromTry = <T>(fn: () => T): Option<T> => {
  try {
    return Option.some(fn());
  } catch {
    return Option.none;
  }
};

interface OptionBuilder {
  some<T>(value: T): Some<T>;
  readonly none: None;
  collectPresent<T>(options: Option<T>[]): T[];
}

export const Option: OptionBuilder = {
  some: <T>(value: T): Some<T> => new Some(value),
  none: None.value,
  collectPresent: <T>(options: Option<T>[]): T[] => options
    .filter((option): option is Some<T> => option.isPresent())
    .map(option => option.get()),
};
