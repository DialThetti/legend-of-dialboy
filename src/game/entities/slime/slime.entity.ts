import { AStar } from '../../../core/ai/a-star';
import { Entity } from '../../../core/entities/entity';
import { EntityState } from '../../../core/entities/entity.state';
import { GameState } from '../../../core/game-state';
import { SlimeRenderer } from './slime.renderer';
import { SlimeState } from './slime.state';

export class SlimeEntity {
  state!: SlimeState;
  renderer!: SlimeRenderer;

  constructor(private gameState: GameState) {}
  async load(state: Partial<SlimeState> & EntityState) {
    this.state = {
      stepTimer: 0,
      velocity: { x: 0, y: 0 },
      currentSleepTime: Math.random(),
      sleepTime: 1,
      speed: 1,
      color: state.color ?? 'GREEN',
      ...state,
    };
    this.renderer = new SlimeRenderer(this);
    await this.renderer.load();
  }

  update(dT: number) {
    // this.state.position.y += dT;
    if (this.state.stepTimer > 0) {
      this.state.position.x += this.state.velocity.x * dT * this.state.speed;
      this.state.position.y += this.state.velocity.y * dT * this.state.speed;
      this.state.stepTimer -= dT * this.state.speed;
      if (this.state.stepTimer <= 0) {
        this.state.position.x = Math.round(this.state.position.x);
        this.state.position.y = Math.round(this.state.position.y);
        this.state.currentSleepTime = this.state.sleepTime;
      }
    } else {
      if (this.state.currentSleepTime > 0) {
        this.state.currentSleepTime -= dT;
        return;
      }
      if (Math.random() < 0.5) {
        //random walk
        let retry = 10;
        do {
          this.state.stepTimer = 1;
          if (Math.random() > 0.5) {
            this.state.velocity = { x: 0, y: Math.random() > 0.5 ? 1 : -1 };
          } else {
            this.state.velocity = { x: Math.random() > 0.5 ? 1 : -1, y: 0 };
          }
          this.getDirectionByVelocity();
          const target = {
            x: this.state.position.x + this.state.velocity.x,
            y: this.state.position.y + this.state.velocity.y,
          };
          if (this.gameState.isSolidTile(target) || target.x < 0 || target.y < 0 || target.x > 15 || target.y > 11) {
            retry--;
            if (retry <= 0) {
              console.log('give up for ', target);
              this.state.velocity = { x: 0, y: 0 };
              this.state.stepTimer = 0;
            }
          } else {
            retry = -1;
          }
        } while (retry >= 0);
      } else {
        //path searching
        const path = new AStar(this.gameState).getPath(this.state.position, this.gameState.player.state.position);
        console.log(path[0]);
        this.state.velocity = path[0];
        this.state.stepTimer = 1;
        this.getDirectionByVelocity();
        return;
      }
    }
  }
  getDirectionByVelocity() {
    if (this.state.velocity.x == 0) {
      this.state.direction = this.state.velocity.y > 0 ? 'DOWN' : 'UP';
    } else {
      this.state.direction = this.state.velocity.x > 0 ? 'RIGHT' : 'LEFT';
    }
  }
  randomInt(x: number): number {
    return Math.floor(Math.random() * x);
  }
}
