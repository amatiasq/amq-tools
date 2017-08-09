/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/**
 * Splits a array into chunks of the same size.
 *
 * @example
 * console.log(chunks([1, 2, 3, 4, 5, 6, 7], 2))
 * > [[1, 2], [3, 4], [5, 6], [7]]
 *
 * @param {Array} list A list to separate un chunks.
 * @param {Number} size The size for each chunk.
 * @returns {Array} A list containing the chunks.
 */
export default function chunks<T>(list: T[], size: number): T[][] {
  const length = Math.ceil(list.length / size);
  const result = [] as T[][];

  for (let i = 0; i < length; i++) {
    const chunk = [] as T[];

    for (let j = 0; j < size; j++)
      chunk.push(list[i * size + j]);

    result.push(chunk);
  }

  return result;
}
