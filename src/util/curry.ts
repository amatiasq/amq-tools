/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/**
 * Decorates a function to not be executed until all required parameters are passed. Even on different calls.
 * It uses functions `.length` property to detect the required arguments count if length is not passed.
 *
 * @link https://gist.github.com/amatiasq/2e4344792f28611fa499
 *
 * @param {Function} fn Function to curry.
 * @param {Number} length The arguments required to invoke the function. Optional. By default is fn.length
 * @returns {Function} The currified function.
 */

export default function curry<TArgs, TOut>(fn: (...args: TArgs[]) => TOut, length = fn.length) {
  return function currified(...args: TArgs[]): Currified<TArgs, TOut> | TOut {
    if (args.length === 0)
      return currified;

    if (args.length >= length)
      return fn.apply(this, args);

    const child = fn.bind(this, ...args);
    return curry(child, length - args.length);
  };
}


export type Currified<TArgs, TOut> = (...args: TArgs[]) => Currified<TArgs, TOut> | TOut;
