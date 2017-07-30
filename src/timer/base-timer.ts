export default abstract class BaseTimer<T> {

  protected _domId: number = null;
  protected _isLooping = false;


  /**
   * Creates a new timer.
   *
   * @param milliseconds {Number} The milliseconds until the callback will be invoked.
   * @param callback {Function} The callback to invoke.
   */
  constructor(
    protected readonly milliseconds: number,
    protected readonly callback: TimerCallback<T>,
  ) {
    this._tick = this._tick.bind(this);
  }


  /**
   * Will schedule the timer to invoke the callback once after `milliseconds`.
   *
   * @returns {Promise<T>|Boolean} False if the timer was already set. True if the timer successfully started.
   */
  schedule(): boolean {
    if (this._domId)
      return false;

    this._domId = this._setTimer();
    return true;
  }


  /**
   * Will cancel next executions of this timer.
   * This will prevent the callback to be invoked again until the timer is
   *   scheduled or started again.
   *
   * @returns {Boolean} False if the timer was not running. True if the timer successfully stopped.
   */
  cancel(): boolean {
    if (!this._domId)
      return false;

    this._clearTimer();
    this._domId = null;
    this._isLooping = false;
    return true;
  }


  /**
   * It will ensure the timer will reset and start the delay again from 0.
   * If the timer is not running it will schedule it.
   */
  reschedule(): void {
    this.cancel();
    this.schedule();
  }


  /**
   * It will start the timer as a repetitive timer.
   * The callback will be called every `milliseconds` milliseconds until it's stopped.
   *
   * @returns {Boolean} False if the timer was already set. True if the timer successfully started.
   */
  start(): boolean {
    this._isLooping = true;
    return this.schedule();
  }


  /**
   * This will prevent the callback to be invoked again until the timer is
   *   scheduled or started again.
   *
   * @returns {Boolean} False if the timer was not running. True if the timer successfully stopped.
   */
  stop(): boolean {
    return this.cancel();
  }


  /**
   * It will ensure the timer will reset and start the delay again from 0.
   * If the timer is not running it will schedule it.
   */
  restart(): void {
    this.stop();
    this.start();
  }


  protected abstract _setTimer(): number;
  protected abstract _clearTimer(): void;


  protected _tick(delay: number) {
    this._domId = null;
    this.callback.call(null, delay);

    if (this._isLooping)
      this.schedule();
  }
}


export type TimerCallback<T> = (delay: number) => T;
