/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
let link: HTMLAnchorElement;

/**
 * Asks the browser to download a given URL as a file.
 *
 * @param {String} url The url to download.
 * @param {String} name The name of the downloaded file.
 */
export default function downloadUrl(url: string, name: string) {
  if (!link) {
    link = document.createElement('a');
  }

  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
