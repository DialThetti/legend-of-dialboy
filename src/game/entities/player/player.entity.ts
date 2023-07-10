import { Entity } from '@game/core/entities/entity';
import { EntityState } from '@game/core/entities/entity.state';
import { PlayerRenderer } from './player.renderer';
import { PlayerState } from './player.state';
import BoundingBox from '../../core/math/rectangle';
import { TileCollider } from '../../core/tile-collider';
import { GameState } from '../../core/game-state';

export class PlayerEntity implements Entity {
  state!: PlayerState;
  renderer!: PlayerRenderer;

  tileCollider!: TileCollider;
  constructor(private gameState: GameState) {}
  async load() {
    this.renderer = new PlayerRenderer(this);
    this.tileCollider = new TileCollider(this.gameState);
    await this.renderer.load();
    this.state = {
      hearts: { current: 3, max: 3 },
      direction: 'UP',
      position: { x: 5, y: 5, z: 100 },
      velocity: { x: 0, y: 0 },
      step: 0,
      speed: 3,
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
    if (this.tileCollider.collidesWithTiles(this).length > 0) {
      this.state.position.x -= this.state.velocity.x * this.state.speed * dT;
      this.state.position.y -= this.state.velocity.y * this.state.speed * dT;
    }
  }

  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 12 / 16, y: 12 / 16 }, { x: 6 / 16, y: 2 / 16 });
  }
}
