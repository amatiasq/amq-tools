/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/**
 * Adds and removes properties from an object.
 * Passed value is not modified, a new object is returned.
 * The returned object will have it's properties sorted aphabetically.
 *
 * @param {Object} object Original object from where properties will be omitted or added.
 * @param {Array<String>} omit A list of properties to omit from the original object in the result object.
 * @param {Object} add Object with properties to add to the returned object. This will behave as Object.assign.
 * @returns {Object} A new object with the final properties sorted alphabetically.
 */

export default function editObject<
  T extends object,
  U extends object
>(
  object: T,
  omit: Array<keyof T> = [],
  add = {} as U,
): Partial<T> & U {
  const result = {} as Partial<T> & U;
  const source = Object.keys(object);
  const copy: (keyof T | keyof U)[] = source.filter((key: keyof T) => omit.indexOf(key) === -1);
  const keys = copy.concat(Object.keys(add)).sort();

  keys.forEach(key => (result as any)[key] = has(add, key) ? add[key] : object[key]);

  return result;
}


function has<T>(object: T, key: string): key is keyof T {
  return key in object;
}


// TODO: Maybe this should be moved somewhere else
declare global {
  interface ObjectConstructor {
    keys<T>(object: T): (keyof T)[];
  }
}
