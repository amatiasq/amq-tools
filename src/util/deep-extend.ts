/**
 * Extends an object with another one combining them whenever it's possible.
 * If both objects (or it's children) have an array on the same property those will be concatenated.
 * If both objects (or it's children) have an object on the same property those will be merged.
 * Otherwise it will be overwriten.
 *
 * @param {Object} target Object to be modified.
 * @param {Object} source Object where properties will be copied from.
 * @returns {Object} The object passed as the first argument.
 */

export default function deepExtend<T extends object, U extends object>(target: T, source: U): T & U {
  const result = target as T & U;

  Object.keys(source).forEach((key: keyof U) => {
    const value = source[key];
    const dest = result[key];
    const sourceType = typeof value;
    const destType = typeof dest;

    if (Array.isArray(value) && Array.isArray(dest))
      result[key] = dest.concat(value);
    else if (sourceType === destType && sourceType === 'object')
      deepExtend(dest, value);
    else
      result[key] = value;
  });

  return result;
}
