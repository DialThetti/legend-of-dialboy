import { AStar } from '@game/core/ai/a-star';
import { Entity } from '@game/core/entities/entity';
import { EntityState } from '@game/core/entities/entity.state';
import { GameState } from '@game/core/game-state';
import { SlimeRenderer } from './slime.renderer';
import { SlimeState } from './slime.state';
import { SlimeMovementAI } from './slime-move.ai';
import BoundingBox from '../../core/math/rectangle';
import { Math2d } from '../../core/math/math-2d';

export class SlimeEntity {
  state!: SlimeState;
  renderer!: SlimeRenderer;

  static slimeMovementAI = new SlimeMovementAI();
  constructor(private gameState: GameState) {}
  async load(state: Partial<SlimeState> & EntityState) {
    this.state = {
      stepTimer: 0,
      currentSleepTime: Math.random(),
      sleepTime: 1,
      speed: 1,
      color: state.color ?? 'GREEN',
      ...state,
      dead: false,
    };
    this.renderer = new SlimeRenderer(this);
    await this.renderer.load();
  }

  update(dT: number) {
    if (this.state.dead) {
      return;
    }
    SlimeEntity.slimeMovementAI.update(dT, this.state, this.gameState);
    if (this.hitBox.overlaps(this.gameState.player.hitBox)) {
      //TODO damage logic
      console.log('pompf');
      const p = this.gameState.player.state.position;
      const e = this.state.position;
      this.gameState.player.hit(0, Math2d.norm({ x: p.x - e.x, y: p.y - e.y }));
    }
  }

  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 1, y: 1 });
  }
  damage() {
    this.state.dead = true;
  }
}
