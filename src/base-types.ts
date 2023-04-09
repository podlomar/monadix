export interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

export interface Monad<T> extends Functor<T> {
  chain<U>(fn: (value: T) => Monad<U>): Monad<U>;
}
