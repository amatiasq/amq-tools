import Timer from '../timer/index';
import StreamSubscription from './subscription';
import { duckType } from './utils';


export default class ReadableStream<T> {

  static fromEvent<T>(object: IEventEmitter<T>, event: string, takeOnly?: number) {
    const stream = new ReadableStream<T>(
      duckType<IEventEmitterOn<T>>(object, 'on') ?
        next => object.on(event, next) :
        next => object.addEventListener(event, next),
    );

    // Linter is fucking with me now
    // tslint:disable-next-line:strict-type-predicates
    return takeOnly == null ? stream : stream.take(takeOnly);
  }


  static merge<T>(...streams: Array<ReadableStream<T>>) {
    const completed = streams.map(() => false);

    return new ReadableStream<T>((push, error, complete) => {
      const subscriptions = streams.map((stream, index) => {
        return stream
          .subscribe(push)
          .then(onComplete, error);

        function onComplete() {
          completed[index] = true;

          if (completed.every(Boolean))
            complete();
        }
      });

      return () => {
        subscriptions.forEach(subscription => subscription.cancel());
      };
    });
  }


  constructor(private onSubscribe: ReadableStreamSource<T>) {}


  subscribe(iterator?: (value: T) => CancelSubscription | void) {
    return new StreamSubscription((resolve, reject) => {
      return this.onSubscribe(iterator || noop);
    });
  }


  forEach(iterator: ReadableIterator<T>) {
    const stream = this;
    let index = 0;

    return this.subscribe((value) => iterator(value, index++, stream));
  }


  map<TOut>(mapper: ReadableMapper<T, TOut>) {
    return new ReadableStream<TOut>(push => {
      return this.forEach((value, index, stream) => {
        push(mapper(value, index++, stream));
      });
    });
  }


  flatMap<TOut>(mapper: ReadableMapper<T, TOut | IIterable<TOut>>) {
    return new ReadableStream<TOut>(push => {
      return this.forEach((value, index, stream) => {
        const mapped = mapper(value, index++, stream);

        if (isIterable(mapped)) {
          mapped.forEach(push);
        } else {
          push(mapped);
        }
      });
    });
  }


  take(count: number) {
    return new ReadableStream<T>(push => {
      const subscription = this.forEach((value, index) => {
        if (index >= count)
          return subscription.cancel();

        return push(value);
      });

      return subscription;
    });
  }


  takeUntil(stopper: Promise<{}>) {
    return new ReadableStream<T>(push => {
      const subscription = this.subscribe(push);
      stopper.then(() => subscription.cancel());
    });
  }


  debounce(milliseconds: number): ReadableStream<T[]>;
  debounce<TOut>(milliseconds: number, join: (list: T[]) => TOut): ReadableStream<TOut>;
  debounce<TOut = T[]>(milliseconds: number, join?: (list: T[]) => TOut): ReadableStream<TOut> {

    return new ReadableStream<TOut>((push: (value: TOut | T[]) => void) => {
      const timer = new Timer(milliseconds, pushBuffer);
      let buffer: T[] = [];

      return this.subscribe(value => {
        buffer.push(value);
        timer.reschedule();
      });

      function pushBuffer() {
        push(join ? join(buffer) : buffer);
        buffer = [];
      }
    });
  }
}


function isIterable<T>(object: T | IIterable<T>): object is IIterable<T> {
    return duckType<IIterable<T>>(object, 'forEach');
}


function noop() {
  // No operation
}


export type IteratorBase<T, TIndex, TCollection, TOutput> =
  (value: T, index: TIndex, collection: TCollection) => TOutput;

export type ReadableMapper<TInput, TOutput> = IteratorBase<TInput, number, ReadableStream<TInput>, TOutput>;
export type ReadableIterator<T> = ReadableMapper<T, void>;

export type CancelSubscription = StreamSubscription | (() => void);
export type ReadableStreamOnNext<T> = (value: T) => void;
export type ReadableStreamOnNextCancellable<T> = (value: T) => CancelSubscription;
export type ReadableStreamOnError = (error: Error) => void;
export type ReadableStreamOnComplete = () => void;

export type ReadableStreamSource<T> = (
  push: ReadableStreamOnNext<T> | ReadableStreamOnNextCancellable<T>,
  error?: ReadableStreamOnError,
  complete?: ReadableStreamOnComplete,
) => CancelSubscription | void;


export interface IIterable<T> {
  forEach(iterator: (value: T) => void): void;
}

export type IEventEmitter<T> = IEventEmitterOn<T> | IEventEmitterAdd<T>;

export interface IEventEmitterOn<T> {
  on(signal: string, listener: (event: T) => void): void;
}

export interface IEventEmitterAdd<T> {
  addEventListener(signal: string, listener: (event: T) => void): void;
}


type EventListener<T> = (value: T) => void;
