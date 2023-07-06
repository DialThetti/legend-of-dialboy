import { GameState } from '../../../core/game-state';
import { SlimeRenderer } from './slime.renderer';
import { SlimeState } from './slime.state';

export class SlimeEntity {
  state!: SlimeState;
  renderer!: SlimeRenderer;

  constructor(private gameState: GameState) {}
  async load(state: Partial<SlimeState>) {
    this.state = {
      ...(state as SlimeState),
      stepTimer: 0,
      velocity: { x: 0, y: 0 },
      sleepTime: Math.random(),
      speed: 1,
      color: state.color ?? 'GREEN',
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
        this.state.sleepTime = 1;
      }
    } else {
      if (this.state.sleepTime > 0) {
        this.state.sleepTime -= dT;
        return;
      }
      if (Math.random() < 0.6) {
        let retry = 10;
        do {
          this.state.stepTimer = 1;
          if (Math.random() > 0.5) {
            this.state.velocity = { x: 0, y: Math.random() > 0.5 ? 1 : -1 };
            this.state.direction = this.state.velocity.y > 0 ? 'DOWN' : 'UP';
          } else {
            this.state.velocity = { x: Math.random() > 0.5 ? 1 : -1, y: 0 };
            this.state.direction = this.state.velocity.x > 0 ? 'RIGHT' : 'LEFT';
          }
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
        this.state.sleepTime = 1;
      }
    }
  }

  randomInt(x: number): number {
    return Math.floor(Math.random() * x);
  }
}
