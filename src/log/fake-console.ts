/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
import getGlobal from '../util/get-global';
import { IConstructor } from './constructor';

type ConsoleMethod = keyof Console;


interface IConsoleEntry {
  type: ConsoleMethod;
  args: any[];
}


export interface IFakeConsole {
  flush(): this;
  restore(): this;
}


const root = getGlobal();
export const wrappedMethods = [
  'assert',
  'dir',
  'error',
  'info',
  'log',
  'time',
  'timeEnd',
  'trace',
  'warn',
];


const realConsole = root.console as Console;
// tslint:disable-next-line:variable-name
const ConsoleClass = realConsole.constructor as IConstructor<Console>;

export default class FakeConsole implements IFakeConsole {

  private queue: IConsoleEntry[] = [];


  constructor(
    private parent: Console,
    private isBatch: boolean,
    private prefix: string,
  ) {
    wrappedMethods.forEach((key: ConsoleMethod) => (this as any)[key] = this.wrap(key));
  }


  flush(): this {
    this.queue.forEach(({type, args}) => {
      (this.parent[type] as any)(...args);
    });

    this.queue = [];
    return this;
  }


  restore(): this {
    root.console = this.parent;
    return this;
  }


  private wrap(method: ConsoleMethod) {
    return (...args: any[]) => {
      if (this.prefix)
        args.unshift(this.prefix);

      if (!this.isBatch)
        return (this.parent[method] as any)(...args);

      return this.queue.push({
        type: method,
        args,
      });
    };
  }
}
