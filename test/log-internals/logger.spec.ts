import Logger from '../../src/log/logger';
import {wrappedMethods} from '../../src/log/fake-console';


function createConsole() {
  const original = window.console;

  return {
    assert: jest.fn(),
    dir: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    time: jest.fn(),
    timeEnd: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
    flushSpy: jest.fn(),
    restoreSpy: jest.fn(),
    flush() {
      this.flushSpy.apply(this, arguments);
      return this;
    },
    restore() {
      this.restoreSpy.apply(this, arguments);
      (window as any).console = original;
      return this;
    }
  };
}


interface IMockedConsole {
  log: jest.Mock<{}>;
  warn: jest.Mock<{}>;
  restore(): void;
}


function mockConsole(): IMockedConsole {
  const original = window.console;
  const restoreSpy = jest.fn();

  const fake = {
    log: jest.fn(),
    warn: jest.fn(),
    restore() {
      (window as any).console = original;
    }
  };

  (window as any).console = fake;
  return fake;
}


describe('log#Logger class', () => {
  let fake: IMockedConsole;

  beforeAll(() => ((window as any).c = window.console));
  afterAll(() => ((window as any).console = window.c));
  beforeEach(() => (fake = mockConsole()));
  afterEach(() => fake.restore());


  it('should throw if invoked without options', () => {
    expect(() => Logger()).toThrow();
  })

  it('should throw if no `createConsole` function is passed', () => {
    expect(() => Logger({})).toThrow();
  })

  it('should be invokable as a function', () => {
    expect(() => Logger({
      createConsole: () => null
    })).not.toThrow();
  });

  it('should return a function', () => {
    const log = makeLogger();
    expect(log).toBeInstanceOf(Function);
  });


  describe('#function method', () => {
    it('should return a function', () => {
      const log = makeLogger();
      const sut = log.function(() => { });
      expect(sut).toBeInstanceOf(Function);
    });

    it('should create a fake console when invoked', () => {
      const spy = jest.fn();
      const log = Logger({
        createConsole() {
          spy();
          return createConsole();
        }
      });

      const sut = log.function(() => { });

      expect(spy).not.toHaveBeenCalled();
      sut();
      expect(spy).toHaveBeenCalledTimes(1);
    });


    describe('printed function name', () => {
      it('should print the provided name', () => {
        const log = makeLogger();
        const sut = log.function(function testName() { });

        sut();
        expect(fake.log).toHaveBeenCalledWith('testName', '(', ')');
      });

      it('should print the function name if no name was provided', () => {
        const log = makeLogger();
        const sut = log.function(() => { }, 'myFunctionPotato');

        sut();
        expect(fake.log).toHaveBeenCalledWith('myFunctionPotato', '(', ')');
      });

      it('should print "anonymous" if the function has no name and no one is provided', () => {
        const log = makeLogger();
        const sut = log.function(() => { });

        sut();
        expect(fake.log).toHaveBeenCalledWith('anonymous', '(', ')');
      })
    });


    describe('arguments printing', () => {
      it('should print commas between the arguments', () => {
        const log = makeLogger();
        const sut = log.function(() => { });

        sut(null, null);
        expect(fake.log).toHaveBeenCalledWith('anonymous', '(', null, ',', null, ')');
      });

      it('should print every argument provided', () => {
        const log = makeLogger();
        const sut = log.function(() => { });

        sut(false, 1, undefined);
        expect(fake.log).toHaveBeenCalledWith('anonymous', '(', false, ',', 1, ',', undefined, ')');
      });

      it('should clean every value before print it', () => {
        const log = makeLogger();
        const sut = log.function(() => { });

        log.cleanValue = () => 'potato';
        sut(1, 2);

        expect(fake.log).toHaveBeenCalledWith('anonymous', '(', 'potato', ',', 'potato', ')');
      });
    })


    describe('invoke original function', () => {
      it('should invoke the original function', () => {
        const log = makeLogger();
        const spy = jest.fn();
        const sut = log.function(spy);

        sut();
        expect(spy).toHaveBeenCalled();
      });

      it('should pass every argument to it', () => {
        const log = makeLogger();
        const spy = jest.fn();
        const sut = log.function(spy);

        sut(true, 2, 'potato');
        expect(spy).toHaveBeenCalledWith(true, 2, 'potato');
      });

      it('should pass the raw version of the arguments', () => {
        const log = makeLogger();
        const spy = jest.fn();
        const sut = log.function(spy);

        log.cleanValue = () => 'potato';
        sut(1, 2);

        expect(spy).toHaveBeenCalledWith(1, 2);
      });
    });


    describe('if the funtion throws error', () => {
      it('should throw the error', () => {
        const log = makeLogger();
        const sut = log.function(() => { throw new Error('fail') });

        expect(() => sut(1, 2)).toThrowError('fail');
      });

      it('should restore the console', () => {
        let fakeConsole;
        const log = Logger({
          createConsole() {
            fakeConsole = createConsole();
            return fakeConsole;
          }
        });

        const sut = log.function(() => { throw new Error('fail') });

        try { sut(); } catch (error) { /* noop */ }
        expect(fakeConsole.restoreSpy).toHaveBeenCalled();
      });

      it('should flush the fake console', () => {
        let fakeConsole;
        const log = Logger({
          createConsole() {
            fakeConsole = createConsole();
            return fakeConsole;
          }
        });

        const sut = log.function(() => { throw new Error('fail') });

        try { sut(); } catch (error) { /* noop */ }
        expect(fakeConsole.flushSpy).toHaveBeenCalled();
      });

      // TODO!!!
      it.skip('should warn about the thrown exception', () => {
        const log = makeLogger();
        const sut = log.function(() => { throw new Error('fail') });

        try { sut(); } catch (error) { /* noop */ }
        expect(fake.warn).toHaveBeenCalledWith(
          'anonymous',
          '*throws*',
          'fail',
          /^at log.function \(/,
        );
      });
    });


    describe('if the function ends successfuly', () => {
      it('should return the value returned by the original function', () => {
        const log = makeLogger();
        const result = Symbol();
        const sut = log.function(() => result);

        expect(sut()).toBe(result);
      });

      it('should restore the console', () => {
        let fakeConsole;
        const log = Logger({
          createConsole() {
            fakeConsole = createConsole();
            return fakeConsole;
          }
        });

        const sut = log.function(() => {});

        sut();
        expect(fakeConsole.restoreSpy).toHaveBeenCalled();
      });

      it('should flush the fake console', () => {
        let fakeConsole;
        const log = Logger({
          createConsole() {
            fakeConsole = createConsole();
            return fakeConsole;
          }
        });

        const sut = log.function(() => {});

        sut();
        expect(fakeConsole.flushSpy).toHaveBeenCalled();
      });

      it('should log the returned value', () => {
        const log = makeLogger();
        const result = 453;
        const sut = log.function(() => result);

        sut();
        expect(fake.log).toHaveBeenCalledWith('anonymous', '<', 453);
      });


      it('should clean the returned value when logging it');
    });
  });


  function makeLogger() {
    return Logger({createConsole});
  }
});
