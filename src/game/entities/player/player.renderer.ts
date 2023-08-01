import { Animation } from '../../render/core/animation';
import { PlayerAnimation } from './player.animation';
import { PlayerEntity } from './player.entity';
import { ItemEntity } from '../item/item.entity';
import { EntityRenderer } from '@game/core/entities/entity.renderer';

export class PlayerRenderer implements EntityRenderer {
  playerAnim!: Animation;
  constructor(private entity: PlayerEntity) {}
  async load() {
    this.playerAnim = await PlayerAnimation.load();
  }

  async render(ctx: CanvasRenderingContext2D, dT: number) {
    let aniId;
    if (this.entity.state.presentItem) {
      aniId = 'presentItem';
      const item = new ItemEntity();
      await item.load({
        id: this.entity.state.presentItem.item,
        position: {
          x: this.entity.state.position.x + 0.25,
          y: this.entity.state.position.y - 1.25,
          z: this.entity.state.position.z,
        },
        velocity: { x: 0, y: 0 },
        direction: 'DOWN',
      });
      item.renderer.render(ctx, dT);
    } else {
      aniId = this.entity.state.direction + '_' + (this.entity.state.step === 0 ? 'IDLE' : 'WALK');
    }
    if (this.entity.state.entityGhost >= 0) {
      ctx.filter = 'sepia(100%)';
    }
    this.playerAnim.getSprite(aniId, dT).draw(ctx, {
      x: Math.floor(this.entity.state.position.x * 16),
      y: Math.floor((3 + this.entity.state.position.y) * 16 - 6),
    });
    ctx.filter = 'none';
    if (this.entity.state.attack) {
      this.entity.state.attack?.area.forEach(b => {
        ctx.strokeRect(b.left * 16, 3 * 16 + b.top * 16, 16 * b.size.x, 16 * b.size.y);
      });
    }
    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.entity.state.position.x * 16, 3 * 16 + this.entity.state.position.y * 16 - 6, 16, 16);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(
        this.entity.hitBox.left * 16,
        3 * 16 + this.entity.hitBox.top * 16,
        16 * this.entity.hitBox.size.x,
        16 * this.entity.hitBox.size.y
      );
      this.entity.tileCollider.render(ctx);
    }
  }
}
