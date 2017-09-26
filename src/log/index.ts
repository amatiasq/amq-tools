/**
 * Copyright (c) 2017-present A. Matías Quezada <amatiasq@gmail.com>
 */
import Logger from './logger';
import FakeConsole from './fake-console';


export default Logger({
  createConsole({singleLine, indentation}) {
    return new FakeConsole(window.console, singleLine, indentation);
  },
});
