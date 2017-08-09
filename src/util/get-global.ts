/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/**
 * Returns the global object for this environment.
 */
export default function getGlobal() {
  if (typeof self === 'object' && isGlobal(self, 'self'))
    return self;

  if (typeof global === 'object' && isGlobal(global, 'global'))
    return global;

  if (typeof window === 'object' && isGlobal(window, 'window'))
    return window;
}


function isGlobal(value: any, name: string) {
  return value[name] === value;
}


declare var global: any;
