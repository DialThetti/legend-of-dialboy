import { Animation } from 'src/render/core/animation';
import { PlayerAnimation } from './player.animation';
import { PlayerEntity } from './player.entity';
import { ItemEntity } from '../item/item.entity';
import { EntityRenderer } from '../../../core/entities/entity.renderer';

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
        direction: 'DOWN',
      });
      item.renderer.render(ctx, dT);
    } else {
      aniId = (this.entity.state.step === 0 ? 'Stand' : '') + this.entity.state.direction;
    }
    this.playerAnim.getSprite(aniId, dT).draw(ctx, {
      x: Math.floor(this.entity.state.position.x * 16),
      y: Math.floor((3 + this.entity.state.position.y) * 16 - 6),
    });

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.entity.state.position.x * 16, 3 * 16 + this.entity.state.position.y * 16 - 6, 16, 16);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.entity.state.position.x * 16 + 2, 3 * 16 + this.entity.state.position.y * 16, 12, 10);
    }
  }
}
