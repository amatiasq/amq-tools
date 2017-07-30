/**
 * Decorates a promise-returning-function to cache the last returned value.
 * The returned function will have a `cached` method which will return the
 *   value used to fulfill the last successful call.
 *
 * @example
 * getServerStatus = syncVersion(getServerStatus);
 * getServerStatus()
 * // later...
 * // if the promise has been fulfilled this will return the value
 * getServerStatus.cached()
 *
 * @param {Function} fn Function to decorate.
 * @returns {Function} Decorated function
 */

export default function syncVersion<T>(fn: (...args: any[]) => Promise<T>): ICached<typeof fn, T> {
  let cache: T = null;
  const substitute = syncWrapper as ICached<typeof fn, T>;
  substitute.cached = cached;
  return substitute;

  function syncWrapper(...args: any[]) {
    const promise = fn.apply(this, args) as Promise<T>;
    promise.then(value => cache = value);
    return promise;
  }

  function cached(): T {
    return cache;
  }
}


type ICached<T extends () => Promise<U>, U> = T & { cached(): U };
