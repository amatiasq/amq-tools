import AnimationTimer from './animation-timer';
import BaseTimer, { TimerCallback } from './base-timer';


/**
 * Creates an object to control delayed time execution. You only need to provide
 *   the callback to invoke and the milliseconds to wait once.
 * After that you can schedule, cancel and reschedule the timer as many times
 *   as you need to.
 */
export default class Timer<T> extends BaseTimer<T> {

  /**
   * Returns a promise to be fulfilled after `milliseconds` milliseconds.
   *
   * @param milliseconds {Number} Milliseconds to wait until the promise is resolved.
   * @param callback {Function?} Optional function to invoke when the timer is over.
   */
  static timeout(milliseconds: number): Promise<number>;
  static timeout<T>(milliseconds: number, callback: TimerCallback<T>): Promise<T>;
  static timeout<T>(milliseconds: number, callback?: TimerCallback<T>) {
    const promise = new Promise<number>((resolve, reject) => setTimeout(resolve, milliseconds));
    return callback ? promise.then(callback) : promise;
  }

  /**
   * Creates and returns a timer scheduled to invoke the callback every
   *   `milliseconds` milliseconds.
   *
   * @param milliseconds {Number} Milliseconds to wait between callback executions.
   * @param callback {Function} Function to invoke on each iteration.
   */
  static interval<T>(milliseconds: number, callback: TimerCallback<T>) {
    const timer = new Timer(milliseconds, callback);
    timer.start();
    return timer;
  }

  /**
   * Creates and returns a timer which will use `requestAnimationFrame` to
   *   invoke the callback.
   *
   * @param callback {Function} Function to invoke on each frame.
   */
  static animation<T>(callback: TimerCallback<T>) {
    return new AnimationTimer(callback);
  }


  protected _setTimer() {
    return Number(setTimeout(this._tick, this.milliseconds));
  }

  protected _clearTimer() {
    return clearTimeout(this._domId);
  }
}
