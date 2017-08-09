/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
let link: HTMLAnchorElement;

/**
 * Returns the current URL search section (`?a=1&b=2`) as a key-value map.
 *
 * @returns {Map} An map containing the keys/values on the URL search section.
 */
export default function getUrlQuery(url: string) {
  const result = new Map<string, string>();

  if (!link) {
    link = document.createElement('a');
  }

  link.href = url;
  link.search
    .substr(1) // remove the '?'
    .split('&')
    .map(entry => entry.split('=').map(decodeURIComponent))
    .forEach(([key, value]) => result.set(key, value));

  return result;
}
