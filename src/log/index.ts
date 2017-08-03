import { IConstructor } from './constructor';
import Logger from './logger';
import FakeConsole, { IFakeConsole } from './fake-console';
import { ILogger, ILoggerOptions } from './logger';


export {
  IFakeConsole,
  IConstructor,
  ILogger,
  ILoggerOptions,
};

export default Logger({
  createConsole({singleLine, indentation}) {
    return new FakeConsole(window.console, singleLine, indentation);
  },
});
