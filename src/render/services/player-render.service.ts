import { loadImage } from '@core/load';
import { PlayerStateService } from '@core/player-state.service';

export class PlayerRenderService {
  player!: HTMLImageElement;

  constructor(private playerState: PlayerStateService) {}
  async load() {
    this.player = await loadImage('./gfx/link.png');
  }

  drawPlayer(ctx: CanvasRenderingContext2D) {
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
  }
}
