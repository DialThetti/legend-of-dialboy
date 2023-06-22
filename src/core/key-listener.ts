import { LoggerService } from '../shared/logger.service';
import { PlayerStateService } from './player-state.service';

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
  };

  constructor(private playerState: PlayerStateService, private loggerService: LoggerService) {}

  private keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.keys.UP = true;
        this.playerState.direction = 'UP';
        break;
      case 'a':
        this.keys.LEFT = true;
        this.playerState.direction = 'LEFT';
        break;
      case 's':
        this.keys.DOWN = true;
        this.playerState.direction = 'DOWN';
        break;
      case 'd':
        this.keys.RIGHT = true;
        this.playerState.direction = 'RIGHT';
        break;
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
    }
  }

  start() {
    document.addEventListener('keydown', e => this.keyDown(e), false);
    document.addEventListener('keyup', e => this.keyUp(e), false);
  }
}
