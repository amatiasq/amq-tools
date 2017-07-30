/**
 * A replacement for JSON.stringify.
 * In case you want to stringify a JSON but keep single-element arrays in a single line.
 * Only valid values in the object are valid JSON values. Passing different values will have unexpected result.
 *
 * @param value {Object} Object to stringify.
 * @param indent {String} This is used for recursivity, just ignore it.
 * @returns {String} The stringified object
 */
export default function stringify(value: any, indent = ''): string | undefined {
  const nextIndent = `${indent}  `;

  if (isNative(value))
    return JSON.stringify(value);

  if (Array.isArray(value)) {
    if (value.length === 1 && isNative(value[0]))
      return JSON.stringify(value);

    const content = value
      .map(entry => stringify(entry, nextIndent))
      .map(entry => typeof entry === 'undefined' ? null : entry)
      .join(`,\n${nextIndent}`);

    return `[\n${nextIndent}${content}\n${indent}]`;
  }

  if (typeof value !== 'object')
    return undefined;

  const keys = Object.keys(value);

  // if (keys.length === 1)
  //   return JSON.stringify(value);

  const content = keys
    .map(key => stringify(value[key], nextIndent))
    .filter(value => typeof value !== 'undefined')
    .map((value, index) => `"${keys[index]}": ${value}`)
    .join(`,\n${nextIndent}`);

  return `{\n${nextIndent}${content}\n${indent}}`;
}


function isNative(value: any): value is string | number | boolean {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean';
}
