type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';

  private constructor() {
    // Set log level from environment variable
    const envLogLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLogLevel && ['debug', 'info', 'warn', 'error'].includes(envLogLevel)) {
      this.logLevel = envLogLevel;
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(logMessage: LogMessage): string {
    const contextStr = logMessage.context 
      ? `\nContext: ${JSON.stringify(logMessage.context, null, 2)}`
      : '';
    
    return `[${logMessage.timestamp}] ${logMessage.level.toUpperCase()}: ${logMessage.message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const logMessage: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    const formattedMessage = this.formatMessage(logMessage);

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  public debug(message: string, context?: Record<string, unknown>) {
    if (this.logLevel === 'debug') {
      this.log('debug', message, context);
    }
  }

  public info(message: string, context?: Record<string, unknown>) {
    if (['debug', 'info'].includes(this.logLevel)) {
      this.log('info', message, context);
    }
  }

  public warn(message: string, context?: Record<string, unknown>) {
    if (['debug', 'info', 'warn'].includes(this.logLevel)) {
      this.log('warn', message, context);
    }
  }

  public error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }
}

export const logger = Logger.getInstance(); 