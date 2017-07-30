/**
 * Prevents a promise function to be called more than once while it's being
 *   executed asynchronously.
 * It will invoke the original function the first time it's called.
 * Next times it will only call the original function if the promise returned
 *   the first time has been fulfilled or rejected.
 * Otherwise it will return the same promise returned the first time.
 *
 * @param {Function} operation The function to be decorated.
 * @returns {Promise} The promise returned by the original function.
 */

export default function throttlePromise<TArgs, TOut>(operation: (...args: TArgs[]) => Promise<TOut>) {
  let promise: Promise<TOut> = null;

  return function(...args: TArgs[]) {
    if (!promise) {
      promise = operation.apply(this, args);
      promise.then(reset, reset);
    }

    return promise;
  };

  function reset() {
    promise = null;
  }
}
