/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
import { IConstructor } from './constructor';
import FakeConsole from './fake-console';
import Logger, { ILogger, ILoggerOptions, ILoggerParams } from './logger';

export default Logger({
  createConsole({singleLine, indentation}) {
    return new FakeConsole(window.console, singleLine, indentation);
  },
});
