import { Animation } from 'src/render/core/animation';
import { PlayerAnimation } from './player.animation';
import { PlayerEntity } from './player.entity';

export class PlayerRenderer {
  playerAnim!: Animation;
  constructor(private entity: PlayerEntity) {}
  async load() {
    this.playerAnim = await PlayerAnimation.load();
  }

  async render(ctx: CanvasRenderingContext2D, dT: number) {
    const aniId = (this.entity.state.step === 0 ? 'Stand' : '') + this.entity.state.direction;
    this.playerAnim.getSprite(aniId, dT).draw(ctx, {
      x: Math.floor(this.entity.state.position.x * 16),
      y: Math.floor((4 + this.entity.state.position.y) * 16 - 6),
    });

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.entity.state.position.x * 16, 4 * 16 + this.entity.state.position.y * 16 - 6, 16, 16);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.entity.state.position.x * 16 + 2, 4 * 16 + this.entity.state.position.y * 16, 12, 10);
    }
  }
}
