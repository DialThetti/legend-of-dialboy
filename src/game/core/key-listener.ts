import { LoggerService } from '../shared/logger.service';

export class KeyListener {
  keys = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
    A: false,
    B: false,
    START: false,
    SELECT: false,
    debug: false,
  };

  constructor(private loggerService: LoggerService) {}

  private keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.keys.UP = true;
        break;
      case 'a':
        this.keys.LEFT = true;
        break;
      case 's':
        this.keys.DOWN = true;
        break;
      case 'd':
        this.keys.RIGHT = true;
        break;
      case ' ':
        this.keys.A = true;
        break;
      case '<':
        this.keys.debug = !this.keys.debug;
        if (this.keys.debug) {
          (window as any).debug = 1;
        } else {
          delete (window as any).debuga;
        }
        break;
      default:
        this.loggerService.log(event.key);
    }
  }
  private keyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.keys.UP = false;
        break;
      case 'a':
        this.keys.LEFT = false;
        break;
      case 's':
        this.keys.DOWN = false;
        break;
      case 'd':
        this.keys.RIGHT = false;
        break;
      case '<':
        break;
      case ' ':
        this.keys.A = false;
        break;
    }
  }

  start() {
    document.addEventListener('keydown', e => this.keyDown(e), false);
    document.addEventListener('keyup', e => this.keyUp(e), false);
  }
}
