/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
import BaseTimer, { TimerCallback } from './base-timer';


export default class AnimationTimer<T> extends BaseTimer<T> {

  constructor(callback: TimerCallback<T>) {
    super(0, callback);
  }

  protected _setTimer() {
    return requestAnimationFrame(this._tick);
  }

  protected _clearTimer() {
    return cancelAnimationFrame(this._domId);
  }
}
