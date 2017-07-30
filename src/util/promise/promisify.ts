/**
 * Polyfill for [Node8 `util.promisify()`](http://2ality.com/2017/05/util-promisify.html)
 * Recives a function and returns a function that when called will add a extra callback parameter
 * The output function will return a promise binded to the callback parameter.
 *
 * @param fn {Function} Function to be decorated
 * @returns {Function} Decorated function.
 */

export default function promisify<TOutput>(fn: (...args: any[]) => void) {
  return (...args: any[]) => {
    return new Promise<TOutput>((resolve, reject) => {
      fn(...args, (error: Error, result: TOutput) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}
