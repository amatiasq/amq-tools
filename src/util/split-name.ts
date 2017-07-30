/**
 * Calculates the space closest to the middle of the name and splits the name there.
 * Returns a object with { first, last }.
 *
 * @param {String} name The name to be splitted.
 * @returns {Object} An object with { first: string, last: string }.
 */

export default function splitName(name: string): { first: string, last: string } {
  const middle = name.length / 2;
  const spaces = [];
  let last = name.indexOf(' ');

  while (last !== -1) {
    spaces.push(last);
    last = name.indexOf(' ', last + 1);
  }

  if (!spaces.length) {
    return {
      first: name,
      last: '',
    };
  }

  const splitAt = spaces.reduce((current, position) => {
    const better = Math.abs(current - middle);
    const distance = Math.abs(position - middle);
    return distance < better ? position : current;
  }, name.length);

  return {
    first: name.substr(0, splitAt),
    last: name.substr(splitAt + 1),
  };
}
