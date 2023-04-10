# Monadix

Functional TypeScript utility types such as Option, Result and others. Focusing on the most practical usage.

## Table of Contents

- [The Option Monad](#the-option-monad)
- [The Result Monad](#the-result-monad)
- [Utility functions](#utility-functions)
- [Troubleshooting](#troubleshooting)
- [Contributions](#contributions)

## The Option Monad

The `Option` monad is a way to handle optional values in a functional and composable way. It provides a standard interface for dealing with values that may or may not exist, without resorting to `null` or `undefined`.

To create a value that exists, use the `some` function, to create a value that does not exist, use the `none` constant:

```ts
import { some, none } from 'monadix/option';

const value = some(42);
const emptyValue = none;
```

You can then use the `map` method to transform the value:

```ts
const transformed = value.map(x => x * 2);
```

The transformed variable now contains a new `Option` value that represents the result of doubling the original value. If the original value did not exist, the transformed value will also not exist.

You can use the `chain` method to `chain` operations that return `Option` values:

```ts
const result = value.chain(x => some(x * 2)).chain(x => some(x.toString()));
```

The result variable now contains a new `Option` value that represents the result of doubling the original value, and then converting it to a string. If the original value did not exist, the result will also not exist.

You can use the `getOrElse` method to get the value if it exists, or a default value if it does not:

```ts
const value = some(42);
const result = value.map(x => x * 2).getOrElse(0);
```

The result variable now contains the value 84, because the original value existed.

You can use the `getOrThrow` method to get the value if it exists, or throw an error if it does not:

```ts
const value = some(42);
const result = value.map(x => x * 2).getOrThrow();
```

The result variable now contains the value 84, because the original value existed.

Finally, you can use the `isPresent` method to check if the value exists:

```ts
const value = some(42);

if (value.isPresent()) {
  console.log(value.get())
}
```

## The Result monad

The `Result` monad is a functional programming concept that is used to handle the outcome of operations that can either succeed or fail. It is similar to the `Option` monad, but includes an customized error message in the case of failure.

Most common use of the `Result` monad is to have a function that returns some value or an error.

For example:

```ts
import { success, fail, Result } from 'monadix/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return fail('Cannot divide by zero');
  }
  
  return success(a / b);
}
```

Once a `Result` instance is created, you can use the `map`, `orElse`, and `chain` methods to perform operations on the value or error message. The match method can be used to pattern match on the value of the `Result`.

```ts
const okResult = divide(10, 5);

const mappedResult = okResult.map(value => value * 2);
// Returns a new Result instance with the value 4

const chainedResult = okResult.chain(value => divide(value, 2));
// Returns a new Result instance with the value 1

const matchedResult = okResult.match({
  success: value => `Result is ${value}`,
  fail: error => `Error: ${error}`,
});
// Returns the string 'Result is 2'

const failResult = divide(10, 0);

const mappedError = failResult.orElse(error => error.toUpperCase());
// Returns a new Result instance with the error message 'CANNOT DIVIDE BY ZERO'
```

You can also use the `getOrElse`, and `getOrThrow` methods to handle the `Result` instance if you want to be more imperative.

For example:

```ts
import { success, fail, Result } from 'monadix/result';

const okResult = divide(10, 5);

console.log(`Result is ${result.getOrElse(0)}`);
console.error(`Error: ${result.getOrThrow()}`);
}
// Logs 'Result is 2'
```

Also, you can use the `isSuccess`, `isFail` method to imperatively check for errors.

For example:

```ts
import { success, fail, Result } from 'monadix/result';

const okResult = divide(10, 5);

if (orResult.isSuccess()) {
  console.log(`Result is ${result.get()}`);
} else {
  console.error(`Error: ${result.err()`);
}
// Logs 'Result is 2'
```

## Utility functions

There are some utility functions to bridge the world if imperative programming.

### `fromNullable`

The `fromNullable` function creates a new `Option` or `Result` instance from a nullable value. If the value is `null` or `undefined`, the function returns an `Option`/`Result` instance containing `none` or `fail`. If the value is not `null` or `undefined`, the function returns an `Option`/`Result` instance containing `some(value)` or `success(value)`.

Example:

```ts
import { success, fail, fromNullable } from 'monadix/result';

interface User {
  name: string;
  email: string;
}

const getUserById(id: number): User | null => {
  // ...
}

const user = fromNullable(getUserById(42)).orElse(
  () => fail(new Error('User not found'));
);
```

### `fromPromise`

Helps to create `Option` or `Result` from promises.

Example:

```ts
import { success, fail, fromPromise, Result } from 'monadix/result';

interface User {
  name: string;
  email: string;
}

function getUserById(id: number): Promise<User> {
  // ...
}

const userResult = await fromPromise(getUserById(42)).orElse(
  (error) => fail(new Error('Failed to get user: ' + error.message));
);

userResult.match({
  success(user) {
    console.log('Got user:', user);
  },
  fail(error) {
    console.error('Failed to get user:', error);
  }
});
```

## Troubleshooting

`TypeScript Error: Cannot find module 'monadix/option' or its corresponding type declarations`

If you receive an error message indicating that the module cannot be found, most likely your `moduleResolution` setting in `tsconfig.json` is not configured correctly. This package requires the use of Node.js version 16 or later.

To resolve this issue, ensure that your `tsconfig.json` file includes the following setting:

```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext" // or "node2022"
  }
}
```

If you continue to experience issues, please open an issue and provide as much detail as possible about your environment and the steps you have taken to reproduce the error.

## Contributions

Contributions are welcome and encouraged! Here are a few guidelines to get started:

1. Fork the repository and create a new branch for your contribution.
1. Write tests for your contribution and make sure all existing tests pass.
1. Ensure that your code adheres to the existing coding standards and conventions.
1. Submit a pull request with a clear description of your changes.

If you encounter any issues or have any questions, please feel free to open an issue or contact me.
