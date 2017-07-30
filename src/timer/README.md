# Timer

A class to handle delayed code execution.

You only need to provide the callback and the milliseconds to delay once in the constructor.
After that you can schedule the timer as many times as you need to.

## Usage

Just create a timer and schedule it when you need it:

```javascript
const renderTimer = new Timer(100, render);
const myAppState = {};
```

After that you can schedule to start the timer:

```javascript
function onDataChange(data) {
  Object.assign(myAppState, data);
  renderTimer.schedule();
}
```

### As single timer

If the timer is already scheduled it will continue with that schedule

```javascript
const start = Date.now();
const timer = new Timer(100, () => console.log(Date.now() - start));
timer.schedule();
setTimeout(() => timer.schedule(), 50);
// Will print 100, the second call didn't delay the timer.
```

> NOTE: For the rest of this section we'll assume all snippets start with
> ```javascript
> const start = Date.now();
> const timer = new Timer(100, () => console.log(Date.now() - start));
> ```

If we want to restart the timer we can call `.reschedule()`

```javascript
timer.schedule();
setTimeout(() => timer.reschedule(), 50);
// Will print 150, the second call did restart the timer.
```

Or we can just cancel it if we want to prevent the callback execution.

```javascript
timer.schedule();
setTimeout(() => timer.cancel(), 50);
// Will not print anything.
```

### As iterator

We have the same behaviour with `.start()` but with `.start()` the timer will
re-schedule itself after the timer is completed creating a loop the same way DOM's
`setInterval()` would do.

```javascript
timer.start();
setTimeout(() => timer.stop(), 350);
// Will print 100, 200 and 300.
```

If we need the timer to reschedule but we don't want to loose the loop behaviour
we can call `.restart()` which will stop and start the timer.

```javascript
timer.start();
setTimeout(() => timer.restart(), 350);
// Will print 100, 200, 300, 450, 550...
```

### Statics

Timer provides a set of simple static methods to generic operations:

#### .timeout(milliseconds, callback?)

Returns a promise to be fulfilled after the provided milliseconds.
If callback is provided it will be invoked as the first promise callback.

```javascript
const start = Date.now();
const promise = Timer.asPromise(100, () => Date.now() - start)
promise.then((elapsedTime) => console.log(elapsedTime));
// Will print 100
```

#### .interval(milliseconds, callback)

Returns a Timer started to invoke the callback every `milliseconds` milliseconds.

```javascript
const start = Date.now();
const timer = Timer.interval(100, () => console.log(Date.now() - start))
setTimeout(() => timer.stop(), 450);
// Will print 100, 200, 300 and 400
```

#### .animation(callback)

Returns a timer which will use
[DOM's `requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
to delay the execution of the callback.
This timer **is not started** so it won't call the callback until you invoke
it's `.schedule()` method for a single execution or `.start()` to start a loop execution.