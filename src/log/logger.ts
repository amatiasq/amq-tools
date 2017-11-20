/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
/* tslint:disable:no-any ban-types no-misused-new */
import getGlobal from '../util/get-global';
import { IConstructor } from './constructor';
import { IFakeConsole } from './fake-console';


const root = getGlobal();
const isLogged = Symbol();
const omitList = new WeakSet();


export interface ILoggerOptions {
  singleLine?: boolean;
  indentation?: string;
}


export interface ILoggerParams extends ILoggerOptions {
  createConsole(options: ILoggerOptions): IFakeConsole;
}


export interface ILogger extends IConstructor<ILogger> {
  constructor: IConstructor<ILogger>;

  indent: number;

  new (options: ILoggerOptions): ILogger;

  <T>(klass: IConstructor<T>): void;
  <T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): void;

  class<T>(klass: IConstructor<T>): void;
  object(object: object, prefix?: string): object;
  function(fn: Function, prefix?: string): Function;
  descriptor<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): PropertyDescriptor;
  method<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): PropertyDescriptor;
  property<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): PropertyDescriptor;

  omit<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): PropertyDescriptor;
  set(options: ILoggerOptions): ILogger;
  cleanValue(value: any): any;
}


export default function Logger({
  createConsole,
  singleLine = false,
  indentation = '->',
}: ILoggerParams) {
  const self = log as any as ILogger;

  if (typeof createConsole !== 'function')
    throw new Error('Logger `createConsole` parameter is required');

  return Object.assign(self, {
    constructor: Logger,
    class: logClass,
    object: logObject,
    function: logFunction,
    descriptor: logDescriptor,
    method: logDescriptor,
    property: logDescriptor,
    omit,
    set,
    cleanValue,
  });


  function log<T>(klass: IConstructor<T>): void;
  function log<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor): void;
  function log(...args: any[]) {
    if (args.length === 1 && isClass(args[0])) {
      return (logClass as any)(...args);
    }
    return (logDescriptor as any)(...args);
  }


  function logFunction(fn: Function, prefix = fn.name || 'anonymous') {
    if ((fn as any)[isLogged])
      return fn;

    return function(...args: any[]) {
      const toLog = args.reduce((output, item, index) => {
        if (index !== 0)
          output.push(',');

        output.push(self.cleanValue(item));
        return output;
      }, []);

      if (!singleLine) {
        console.log(prefix, '(', ...toLog, ')');
      }

      const fake = createConsole({singleLine, indentation});
      (window as any).console = fake;
      let result;

      try {
        // tslint:disable-next-line:no-invalid-this
        result = fn.apply(this, args);
      } catch (error) {
        fake.restore();

        if (singleLine) {
          console.log(prefix, '(', ...toLog, ')');
        }

        fake.flush();
        const at = error.stack ? error.stack.split('\n')[1].trim() : error;
        (window as any).b = error;

        console.warn(prefix, '*throws*', error.message, at);
        throw error;
      }

      fake.restore();

      if (singleLine) {
        console.log(prefix, '(', ...toLog, ') >', self.cleanValue(result));
      } else {
        console.log(prefix, '<', self.cleanValue(result));
      }

      fake.flush();
      return result;
    };
  }


  function logDescriptor<T>(instance: T, key: keyof T, descriptor: PropertyDescriptor) {
    return internal(instance.constructor.name, key, descriptor);
  }


  function logClass<T>(klass: IConstructor<T>) {
    const descriptors = logDescriptors(klass.prototype, klass.name);
    Object.defineProperties(klass.prototype, descriptors);
    return klass;
  }


  function logObject<T extends object>(object: T, name: string = null) {
    const descriptors = logDescriptors(object, name);
    Object.defineProperties(object, descriptors);
    return object;
  }


  function logDescriptors<T extends object>(object: T, name = 'anonymous') {
    const descriptors: { [key: string]: PropertyDescriptor } = {};

    Reflect.ownKeys(object).forEach((key: keyof T) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
      const {value} = descriptor;
      const isConstructor = key === 'constructor';
      const isFunction = typeof value === 'function';
      const shouldOmit = omitList.has(descriptor.value);

      if (!descriptor.configurable) {
        console.warn(`Can't hook readonly property ${name}.${key}`);
        return;
      }

      descriptors[key] =  isConstructor || !isFunction || shouldOmit ?
        descriptor :
        internal(name, key, descriptor);
    });

    return descriptors;
  }


  function omit<T>(instance: T | Function, key: keyof T, descriptor: PropertyDescriptor) {
    omitList.add(arguments.length === 1 ? instance : descriptor.value);
    return descriptor;
  }


  function internal(container: string, key: string, descriptor: PropertyDescriptor) {
    const {value} = descriptor;
    const prefix = `${container}.${key}`;
    descriptor.value = logFunction(descriptor.value, prefix);
    return descriptor;
  }


  function set(config: ILoggerOptions) {
    return Logger(Object.assign({
      createConsole,
      singleLine,
      indentation,
    }, config));
  }


  function cleanValue(value: any) {
    if (typeof value === 'string') {
      return JSON.stringify(value);
    }

    if (value && value.$$typeof) {
      return value.$$typeof;
    }

    return value;
  }
}


function isClass(value: any): value is Function {
  return typeof value === 'function';
}
