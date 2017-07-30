import log from '../src/log';

class Calculator {
  sum(left: number, right: number) {
    console.log('I know how to sum!!!');
    return left + right;
  }
  subtract(left: number, right: number) {
    return this.sum(left, -right);
  }
}

Object.assign(window, {
  log,
  Calculator,
});
