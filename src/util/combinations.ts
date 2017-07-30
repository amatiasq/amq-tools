

/**
 * Retuns every possible combination of a given set of elements.
 *
 * @example
 * combinations('abc'.split(''), 2);
 * > [['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'b'] ...]
 *
 * @param {Array} array Elements to combine.
 * @param {Number} length Max length for resulted combinations.
 * @returns {Array} A list with all the possible combinations.
 */
export default function combinations<T>(array: T[], length: number) {
  const list = [] as T[][];
  let keys = [0];

  while (keys) {
    list.push(keys.map(x => array[x]).reverse());
    keys = next(keys, array.length, length);
  }

  return list;
}


function translate<T>(array: T[], keys: number[]) {
  return keys
    .map(x => array[x])
    .reverse();
}


function next<T>(keys: number[], max: number, dimensions: number) {
  let index = 0;

  keys = keys.slice();
  keys[index]++;

  while (keys[index] === max) {
    keys[index] = 0;
    index++;

    if (index >= dimensions) {
      return null;
    }

    if (index === keys.length) {
      keys[index] = 0;
    } else {
      keys[index]++;
    }
  }

  return keys;
}
