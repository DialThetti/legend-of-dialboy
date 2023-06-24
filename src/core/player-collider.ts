import { Entity } from 'src/models/entity';
import { PlayerStateService } from './player-state.service';
import { EntityCollider } from './entity-collider';

export class PlayerCollider {
  constructor(private playerState: PlayerStateService, private entityCollider: EntityCollider) {}

  collidesWithTile(x: number, y: number): boolean {
    const pRect = {
      x: this.playerState.position.x * 16 + 2,
      y: this.playerState.position.y * 16,
      w: 12,
      h: 10,
    };
    if (x < 0) {
      return (
        this.playerState.isSolidTile({ x: pRect.x / 16 + x, y: pRect.y / 16 }) ||
        this.playerState.isSolidTile({ x: pRect.x / 16 + x, y: (pRect.y + pRect.h) / 16 })
      );
    } else if (x > 0) {
      return (
        this.playerState.isSolidTile({ x: (pRect.x + pRect.w) / 16 + x, y: pRect.y / 16 }) ||
        this.playerState.isSolidTile({ x: (pRect.x + pRect.w) / 16 + x, y: (pRect.y + pRect.h) / 16 })
      );
    } else if (y < 0) {
      return (
        this.playerState.isSolidTile({ x: pRect.x / 16, y: pRect.y / 16 + y }) ||
        this.playerState.isSolidTile({ x: (pRect.x + pRect.w) / 16, y: pRect.y / 16 + y })
      );
    } else if (y > 0) {
      return (
        this.playerState.isSolidTile({ x: pRect.x / 16, y: (pRect.y + pRect.h) / 16 + y }) ||
        this.playerState.isSolidTile({ x: (pRect.x + pRect.w) / 16, y: (pRect.y + pRect.h) / 16 + y })
      );
    }
    return false;
  }

  collidesWithEntity(entity: Entity): boolean {
    let { x, y } = this.playerState.position;
    x *= 16;
    y *= 16;
    const ex = entity.position.x * 16;
    const ey = entity.position.y * 16;

    return this.entityCollider.collide(
      { position: { x: x + 2, y }, size: { width: 12, height: 10 } },
      {
        position: { x: ex, y: ey },
        size: entity.size,
      }
    );
  }
}
