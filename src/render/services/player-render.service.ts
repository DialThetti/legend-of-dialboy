import { loadImage } from '@core/load';
import { PlayerStateService } from '@core/player-state.service';

export class PlayerRenderService {
  player!: HTMLImageElement;

  constructor(private playerState: PlayerStateService) {}
  async load() {
    this.player = await loadImage('./gfx/link.png');
  }

  async drawPlayer(ctx: CanvasRenderingContext2D) {
    const renderableEntities = this.playerState.map.entities.filter(e => e.traits.find(t => t.name === 'renderable'));

    await Promise.all(
      renderableEntities.map(async e => {
        const r = e.traits.find(t => t.name === 'renderable');
        const i = await loadImage('./gfx/' + r?.payload.spritesheet);
        const spritePos = r?.payload.position;
        ctx.drawImage(
          i,
          spritePos.x,
          spritePos.y,
          e.size.width,
          e.size.height,
          e.position.x * 16,
          e.position.y * 16 + 4 * 16,
          e.size.width,
          e.size.height
        );
      })
    );

    let [sx, sy] = {
      LEFT: [30, 0],
      UP: [62, 0],
      DOWN: [0, 0],
      RIGHT: [91, 0],
    }[this.playerState.direction] ?? [0, 0];
    if (this.playerState.step > 5) {
      sy += 30;
    }
    ctx.drawImage(
      this.player,
      sx,
      sy,
      16,
      16,
      this.playerState.position.x * 16,
      (4 + this.playerState.position.y) * 16 - 6,
      16,
      16
    );

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';
      this.playerState.map.entities.forEach(entity => {
        ctx.strokeRect(entity.position.x * 16, 4 * 16 + entity.position.y * 16, entity.size.width, entity.size.height);
      });
      ctx.strokeRect(this.playerState.position.x * 16, 4 * 16 + this.playerState.position.y * 16 - 6, 16, 16);
    }
  }
}
