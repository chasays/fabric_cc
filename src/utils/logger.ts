export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  static error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error.stack);
    }
  }

  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }
}
