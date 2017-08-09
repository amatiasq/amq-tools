/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/**
 * Decorates a function to not be executed until all promise parameters are fulfilled.
 *
 * @example
 * const sum = (first: number, second: number) => first + second;
 * const asyncSum = asyncParams(sum);
 * asyncSum(Promise.resolve(1), 2).then(result => console.log(result));
 *
 * @param {Function} fn Function to be decorated.
 * @param {Function} Decorated function.
 */

export default function asyncParams<T, U>(fn: (...args: Value<T>[]) => U) {
  return function(...args: Value<T>[]): Promise<U> {
    const execute = (values: T[]) => fn.apply(this, values);
    const hasPromise = args.some(isPromise);

    if (hasPromise)
      return Promise.all(args).then(execute);

    return Promise.resolve(execute(args as T[]));
  };
}


function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function';
}


export type Value<T> = Promise<T> | T;
