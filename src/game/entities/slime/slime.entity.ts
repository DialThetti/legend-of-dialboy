import { AStar } from '@game/core/ai/a-star';
import { Entity } from '@game/core/entities/entity';
import { EntityState } from '@game/core/entities/entity.state';
import { GameState } from '@game/core/game-state';
import { SlimeRenderer } from './slime.renderer';
import { SlimeState } from './slime.state';
import { SlimeMovementAI } from './slime-move.ai';
import BoundingBox from '../../core/math/rectangle';

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
    };
    this.renderer = new SlimeRenderer(this);
    await this.renderer.load();
  }

  update(dT: number) {
    SlimeEntity.slimeMovementAI.update(dT, this.state, this.gameState);
    if (this.hitBox.overlaps(this.gameState.player.hitBox)) {
      //TODO damage logic
      console.log('pompf');
    }
  }

  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 1, y: 1 });
  }
}
