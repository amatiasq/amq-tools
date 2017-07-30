# Logger

A simple logger tool to intercept method / function calls. Hooks on the passed class / function and logs when it's
invoked and the argument list and also the return value. Additionally every `console.log()` call made during the
function execution will be indented in the console.

```javascript
const log = require('amq-utils/log');

class Calculator {
  sum(left, right) {
    console.log('I know how to sum!!!');
    return left + right;
  }
  subtract(left, right) {
    return this.sum(left, -right);
  }
}

// Will hook every method in Calculator
log(Calculator);

const test = new Calculator();
test.subtract(3, 1);
```

Outputs:

```
Calculator.subtract ( 3 , 1 )
-> Calculator.sum ( 3 , -1 )
-> -> I know how to sum!!!
-> Calculator.sum < 2
Calculator.subtract < 2
```

## Usage

You can use the function directly by passing a class:

```javascript
const log = require('amq-utils/log');

class MyClass {}

// Will hook every method in MyClass
log(MyClass);
```

### As decorator

You can use `log()` function to decorate classes and methods:

```javascript
// Will hook every method in MyClass
@log
class MyClass {}

class MyOtherClass {
  methodA() {}
  methodB() {}

  // Only methodC will be hooked
  @log
  methodC() {}
}
```

### For functions

If you want to decorate a single function you can use `log.function`:

```javascript
function myFunction() {}

// We'll recive logs when myFunction
myFunction = log.function(myFunction);
```

### For objects

Or to decorate all function properties in a given object you can use `log.object`:

```javascript
const calc = new Calculator();

log.object(calc);

calc.subtract(3, 2);
```

Produces the same output as if we logged the Calculator class but just for this instance.

```
Calculator.subtract ( 3 , 1 )
-> Calculator.sum ( 3 , -1 )
-> -> I know how to sum!!!
-> Calculator.sum < 2
Calculator.subtract < 2
```

The object name is extracted from `object.constructor.name` but you can provide any name to be used on the logs:

```javascript
log.object(calc, 'calc');
```

```
calc.subtract ( 3 , 1 )
...
```

## Options

Logger has a `set()` method which allows you to change it's configuration. This method **will not modify the original log** but return a new instance instead. You can reassign it to overwrite the global behaviour:

```javascript
log = log.set({ singleLine: true });
```

Or you can configure it for a single invocation:

```javascript
@log.set({ singleLine: true })
class MyClass {}
```

### singleLine

In case you don't need separated lines for each function lines (invocation and return value) you can use the `singleLine` option. If we continue with the `Calculator` example we'll se the output is different:

```javascript
log.set({ singleLine: true })(Calculator);

const test = new Calculator();
test.subtract(3, 1);
```

Will output:

```
Calculator.subtract ( 3 , 1 ) > 2
-> Calculator.sum ( 3 , -1 ) > 2
-> -> I know how to sum!!!
```

As you can see the return value is printed on the same line as the arguments and every log printed inside the function is printed after with the corresponding indentation333.

### indentation

To customize the string used for indentation you can set this option to any value. Following the previous example:

```javascript
log.set({ indentation: '$' })(Calculator);

const test = new Calculator();
test.subtract(3, 1);
```

```
Calculator.subtract ( 3 , 1 )
$ Calculator.sum ( 3 , -1 )
$ $ I know how to sum!!!
$ Calculator.sum < 2
Calculator.subtract < 2
```
