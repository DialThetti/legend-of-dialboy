import { Animation } from '../../render/core/animation';
import { SpriteSheet } from '../../render/core/spritesheet';
import { ItemEntity } from './item.entity';

export class ItemRenderer {
  anim!: Animation;
  constructor(private entity: ItemEntity) {}
  async load() {
    const spritesheet = await SpriteSheet.of('./gfx/pausescreen.png', {
      swordL1: { x: 555, y: 137, w: 8, h: 16 },
    });
    this.anim = new Animation(spritesheet, { swordL1: { steps: ['swordL1'], duration: 0 } });
  }

  async render(ctx: CanvasRenderingContext2D, dT: number) {
    this.anim.getSprite(this.entity.state.id, dT).draw(ctx, {
      x: Math.floor(this.entity.state.position.x * 16),
      y: Math.floor((4 + this.entity.state.position.y) * 16 - 6),
    });

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.entity.state.position.x * 16, 4 * 16 + this.entity.state.position.y * 16 - 6, 16, 16);
    }
  }
}
