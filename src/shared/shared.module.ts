import { ClockService } from './clock';
import { LoggerService } from './logger.service';

export class SharedModule {
  private static instance?: SharedModule;
  loggerService = new LoggerService();
  clock = new ClockService();

  static get(): SharedModule {
    if (!SharedModule.instance) {
      SharedModule.instance = new SharedModule();
    }
    return SharedModule.instance;
  }
}
