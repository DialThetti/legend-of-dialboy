import { Animation } from 'src/render/core/animation';
import { SpriteSheet } from 'src/render/core/spritesheet';
import { SlimeEntity } from './slime.entity';
import DEFAULT_ANIMATION from '../../../render/core/ani.default.json';
import DEFAULT_SPRITESHEET from '../../../render/core/spritesheet.default.json';
export class SlimeRenderer {
  anim!: Animation;
  constructor(private entity: SlimeEntity) {}
  async load() {
    const spritesheet = await SpriteSheet.of(
      {
        GREEN: './gfx/enemies/Enemy_001.png',
        RED: './gfx/enemies/Enemy_002.png',
        BLUE: './gfx/enemies/Enemy_003.png',
        VIOLET: './gfx/enemies/Enemy_004.png',
      }[this.entity.state.color],
      DEFAULT_SPRITESHEET
    );

    this.anim = new Animation(spritesheet, DEFAULT_ANIMATION as any);
  }

  async render(ctx: CanvasRenderingContext2D, dT: number) {
    this.anim
      .getSprite(
        this.entity.state.direction + '_' + (this.entity.state.stepTimer > 0 ? 'WALK' : 'IDLE'),
        dT * this.entity.state.speed
      )
      .draw(ctx, {
        x: Math.floor(this.entity.state.position.x * 16 - 4),
        y: Math.floor((3 + this.entity.state.position.y) * 16 - 6 - 4),
      });

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.entity.state.position.x * 16, (3 + this.entity.state.position.y) * 16, 16, 16);
    }
  }
}
