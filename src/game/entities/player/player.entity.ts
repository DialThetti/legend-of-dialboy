import { Entity } from '@game/core/entities/entity';
import { EntityState } from '@game/core/entities/entity.state';
import { PlayerRenderer } from './player.renderer';
import { PlayerState } from './player.state';
import BoundingBox from '../../core/math/rectangle';
import { TileCollider } from '../../core/tile-collider';
import { GameState } from '../../core/game-state';
import { Point2d } from '../../core/math/point-2d';

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
      direction: 'DOWN',
      position: { x: 3.3, y: 4, z: 100 },
      velocity: { x: 0, y: 0 },
      step: 0,
      speed: 3,
      ghost: false,
      forcedWay: 0,
      entityGhost: 0,
    };
  }
  async update(dT: number) {
    if (this.state.attack) {
      if (!this.state.attack?.properties?.includes('cooldown') && (await this.gameState.mapEntity.interact(this))) {
        debugger;
        this.state.attack.timer = 0;
      } else {
        this.state.attack.timer -= dT;
        this.gameState.entities.forEach(e =>
          this.state.attack?.area.forEach(a => {
            if (e.hitBox.overlaps(a)) {
              (e as any).damage?.();
            }
          })
        );
      }

      if (this.state.attack?.timer <= 0) {
        if (this.state.attack?.next) {
          this.state.attack = this.state.attack.next;
        } else {
          delete this.state.attack;
        }
      }
    }
    if (this.state.entityGhost >= 0) {
      this.state.entityGhost -= dT;
    }
    if (this.state.presentItem) {
      this.state.presentItem.timer -= dT;
      if (this.state.presentItem.timer <= 0) {
        delete this.state.presentItem;
      }
    }
    if (this.state.forcedWay > 0) {
      this.state.forcedWay -= dT;
      if (!this.move(5, dT)) {
        this.state.forcedWay = -1;
      }
      if (this.state.forcedWay < 0) {
        this.state.velocity = { x: 0, y: 0 };
        this.state.forcedWay = 0;
      }
    } else {
      if (!this.state.attack || this.state.attack?.properties?.includes('cooldown')) {
        this.move(this.state.speed, dT);
      }
    }
  }

  async move(speed: number, dT: number): Promise<boolean> {
    this.state.position.x += this.state.velocity.x * speed * dT;
    this.state.position.y += this.state.velocity.y * speed * dT;
    this.state.position.x = Math.round(this.state.position.x * 16) / 16;
    this.state.position.y = Math.round(this.state.position.y * 16) / 16;
    if (this.tileCollider.collidesWithTiles(this).length > 0) {
      this.state.position.x -= this.state.velocity.x * speed * dT;
      this.state.position.y -= this.state.velocity.y * speed * dT;
      this.state.position.x = Math.round(this.state.position.x * 16) / 16;
      this.state.position.y = Math.round(this.state.position.y * 16) / 16;
      return false;
    }

    //event detection
    const e = this.gameState.mapEntity.collidesWithEvent(this);
    return true;
  }
  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 12 / 16, y: 12 / 16 }, { x: 6 / 16, y: 2 / 16 });
  }
  hit(dmg: number, direction: Point2d) {
    if (this.state.entityGhost > 0) {
      return;
    }
    if (this.state.attack?.properties?.includes('invicible')) {
      return;
    }
    this.state.hearts.current -= 0.5;
    if (this.state.hearts.current == 0) {
      alert('dead');
      window.location = window.location;
    }
    this.state.velocity = direction;
    this.state.forcedWay = 0.1;
    this.state.entityGhost = 1;
  }
}
