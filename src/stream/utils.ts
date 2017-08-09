/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
// tslint:disable-next-line:no-any
export function duckType<T>(object: any, key: string): object is T {
    return key in object;
}
