# typephoon

Functional TypeScript utility types such as Option, Result and others.

## Using the Result monad

The `Result` monad is a functional programming concept that is used to handle the outcome of operations that can either succeed or fail. It is similar to the `Option` monad, but includes an error message in the case of failure.

Most common use of the `Result` monad is to have a function that returns some value or an error.

For example:

```ts
import { success, fail, Result } from 'typehoon/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return fail('Cannot divide by zero');
  }
  
  return success(a / b);
}
```

Once a `Result` instance is created, you can use the `map`, `mapErr`, and `chain` methods to perform operations on the value or error message. The match method can be used to pattern match on the value of the `Result`.

```ts
const okResult = divide(10, 5);

const mappedResult = okResult.map(value =>value * 2);
// Returns a new Result instance with the value 4

const chainedResult = okResult.chain(value =>divide(value, 2));
// Returns a new Result instance with the value 1

const matchedResult = okResult.match({
  success: value => `Result is ${value}`,
  fail: error => `Error: ${error}`,
});
// Returns the string 'Result is 2'

const failResult = divide(10, 0);

const mappedError = failResult.mapErr(error =>error.toUpperCase());
// Returns a new Result instance with the error message 'CANNOT DIVIDE BY ZERO'
```

You can also use the `getOrElse`, and `getOrThrow` methods to handle the `Result` instance if you want to be more imperative.

For example:

```ts
import { success, fail, Result } from 'typehoon/result';

const okResult = divide(10, 5);

console.log(`Result is ${result.getOrElse(0)}`);
console.error(`Error: ${result.getOrThrow()}`);
}
// Logs 'Result is 2'
```

Also, you can use the `isSuccess`, `isFail` method to imperatively check for errors.

For example:

```ts
import { success, fail, Result } from 'typehoon/result';

const okResult = divide(10, 5);

if (orResult.isSuccess()) {
  console.log(`Result is ${result.get()}`);
} else {
  console.error(`Error: ${result.err()`);
}
// Logs 'Result is 2'
```
