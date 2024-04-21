import { ConsoleLogger } from '@nestjs/common';
import { isLogLevelEnabled } from '@nestjs/common/services/utils/is-log-level-enabled.util';

export enum LogLevel {
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    LOG = 'log',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
}

const LOG_LEVELS = [LogLevel.VERBOSE, LogLevel.DEBUG, LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];

export class PRMLogger extends ConsoleLogger {
    private static logLevels: LogLevel[] = [LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];

    constructor(context: string) {
        super(context);
    }

    isLevelEnabled(level: LogLevel) {
        return isLogLevelEnabled(level, PRMLogger.logLevels);
    }

    static setLogLevel(level: LogLevel | false): void {
        PRMLogger.logLevels = level === false ? [] : LOG_LEVELS.slice(LOG_LEVELS.indexOf(level));
    }
}
