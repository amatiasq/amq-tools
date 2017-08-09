/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
export default class CancellablePromise<T> extends Promise<T> {

  protected _cancel: CancellableExecutor;
  protected _onCancel: CancelListener[];
  protected _isCancelled: boolean;

  constructor(executor: Executor<T>) {
    let cancel;

    super((resolve, reject) => {
      cancel = executor(
        value => !this._isCancelled && resolve(value),
        reason => !this._isCancelled && reject(reason),
      );
    });

    this._cancel = cancel;
    this._onCancel = [];
    this._isCancelled = false;
  }


  cancel(): boolean {
    if (this._isCancelled) {
      return false;
    }

    this._isCancelled = true;
    this._onCancel.forEach(fn => fn());

    if (this._cancel instanceof CancellablePromise)
      return this._cancel.cancel();

    if (typeof this._cancel === 'function')
      return this._cancel.call(null) !== false;

    return false;
  }


  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: OnFulfilled<T, TResult1>,
    onrejected?: OnRejected<TResult2>,
    oncancel?: OnCancelled,
  ) {
    if (typeof oncancel === 'function')  {
      if (this._isCancelled) {
        oncancel();
      } else {
        this._onCancel.push(oncancel);
      }
    }

    const result = super.then(onfulfilled, onrejected) as any as CancellablePromise<TResult1 | TResult2>;
    result._cancel = () => this.cancel();

    return result;
  }
}


export type CancellableExecutor = CancelPromise | CancellablePromise<any> | null;
export type CancelPromise = () => boolean;
export type CancelListener = () => void;

export type Resolver<T> = (value?: T | PromiseLike<T>) => void;
export type Rejector = (reason?: any) => void;
export type Executor<T> = (resolve: Resolver<T>, reject: Rejector) => CancellableExecutor;

export type OnFulfilled<T, TResult1> = (value: T) => TResult1 | PromiseLike<TResult1>;
export type OnRejected<TResult2> = (reason: any) => TResult2 | PromiseLike<TResult2>;
export type OnCancelled = (() => void);
