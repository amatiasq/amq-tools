/**
 * Modifies an A element to download a canvas' content as a PNG image.
 *
 * @param {HTMLAnchorElement} link Element to fire the download.
 * @param {HTMLCanvasElement} canvas Element containing the image to be downloaded.
 * @param {String} name Name of the downloaded file.
 * @returns {null}
 */

export default function downloadCanvas(
  link: HTMLAnchorElement,
  canvas: HTMLCanvasElement,
  name: string,
) {
  const dataUrl = canvas.toDataURL('image/jpeg');

  if (window.navigator.msSaveBlob) {
    // IE
    link.setAttribute('href', '#');
    link.addEventListener('click', () => {
      const buffer = (window as any).Base64Binary.decodeArrayBuffer(dataUrl.substring(23));
      const blob = new Blob([ buffer ], { type: 'image/jpg' });
      window.navigator.msSaveBlob(blob, name);
    }, true);

    return;
  }

  // Firefox and Chrome
  link.setAttribute('href', dataUrl);
  link.setAttribute('download', name);
}
