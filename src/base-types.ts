export interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

export interface Chainable<T> {
  chain<U>(fn: (value: T) => Chainable<U>): Chainable<U>;
}

export interface Monad<T> extends Functor<T>, Chainable<T> {}
