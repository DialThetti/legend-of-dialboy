import { Entity } from '@game/core/entities/entity';
import { EntityState } from '@game/core/entities/entity.state';
import { PlayerRenderer } from './player.renderer';
import { PlayerState } from './player.state';
import BoundingBox from '../../core/math/rectangle';

export class PlayerEntity implements Entity {
  state!: PlayerState;
  renderer!: PlayerRenderer;

  async load() {
    this.renderer = new PlayerRenderer(this);
    await this.renderer.load();
    this.state = {
      hearts: { current: 3, max: 3 },
      direction: 'UP',
      position: { x: 5, y: 5, z: 100 },
      velocity: { x: 0, y: 0 },
      step: 0,
      speed: 2,
      ghost: false,
    };
  }
  async update(dT: number) {
    if (this.state.presentItem) {
      this.state.presentItem.timer -= dT;
      if (this.state.presentItem.timer <= 0) {
        delete this.state.presentItem;
      }
    }
    this.state.position.x += this.state.velocity.x * this.state.speed * dT;
    this.state.position.y += this.state.velocity.y * this.state.speed * dT;
  }

  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 1, y: 1 });
  }
}
