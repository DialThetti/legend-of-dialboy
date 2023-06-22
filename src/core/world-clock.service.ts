import { KeyListener } from './key-listener';
import { PlayerStateService } from './player-state.service';

export class WorldClock {
  currentWalk?: string;
  constructor(private playerState: PlayerStateService, private keyListener: KeyListener) {}

  update() {
    if (this.currentWalk) {
      switch (this.currentWalk) {
        case 'u':
          this.playerState.position.y -= 1 / 10;
          this.playerState.direction = 'UP';
          break;
        case 'd':
          this.playerState.position.y += 1 / 10;
          this.playerState.direction = 'DOWN';
          break;
        case 'l':
          this.playerState.position.x -= 1 / 10;
          this.playerState.direction = 'LEFT';
          break;
        case 'r':
          this.playerState.position.x += 1 / 10;
          this.playerState.direction = 'RIGHT';
          break;
      }
      this.playerState.step--;
      if (this.playerState.step == 0) {
        this.currentWalk = undefined;
        this.playerState.position.x = Math.round(this.playerState.position.x);
        this.playerState.position.y = Math.round(this.playerState.position.y);
      }
    } else {
      const { x, y } = this.playerState.position;
      if (this.keyListener.keys.LEFT) {
        if (this.playerState.isSolidTile({ x: x - 1, y })) {
          return;
        }
        this.currentWalk = 'l';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.RIGHT) {
        if (this.playerState.isSolidTile({ x: x + 1, y })) {
          return;
        }
        this.currentWalk = 'r';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.UP) {
        if (this.playerState.isSolidTile({ x, y: y - 1 })) {
          return;
        }
        this.currentWalk = 'u';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.DOWN) {
        if (this.playerState.isSolidTile({ x, y: y + 1 })) {
          return;
        }
        this.currentWalk = 'd';
        this.playerState.step = 10;
      }
    }
  }
}
