import getSyncVersion from './sync-version';

/**
 * Will add a method to the provided object which will store the last value
 *   returned successfully by calling `method`.
 * The original method will be decorated, you can restore the original one by
 *   calling `.restore()` property of that method.
 * Keep in mind that this will break the sync version.
 *
 * @example
 * addSyncMethod(server, 'getStatus', 'getStatusSync');
 * server.getStatus();
 * // Later...
 * // If `server.getStatus()` has ben fulfilled this will return the last successful value
 * server.getStatusSync()
 *
 * @param {Object} object Object to add the method to.
 * @param {String} method The original method to hook.
 * @returns {Object} The object passed as argument.
 */

export default function addSyncMethod<T>(object: T, method: keyof T, name = `${method}Sync`): T {
  const original = object[method];

  if (typeof original !== 'function') {
    throw new Error(`[addSyncMethod] Property "${method}" is not a function.`);
  }

  const substitute = getSyncVersion(original as any);
  const {cached} = substitute;
  delete substitute.cached;

  const replacement = substitute as any;
  replacement.original = original;
  replacement.restore = restore;

  const result = object as any;
  result[name] = cached;
  result[method] = replacement;

  return result as T;

  function restore() {
    object[method] = original;
  }
}
