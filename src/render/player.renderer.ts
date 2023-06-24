import { PlayerStateService } from '@core/player-state.service';
import { Animation } from './core/animation';
import { SpriteSheet } from './core/spritesheet';

export class PlayerRenderer {
  player!: SpriteSheet;

  playerAnim!: Animation;
  constructor(private playerState: PlayerStateService) {}
  async load() {
    this.player = await SpriteSheet.of('./gfx/link.png', {
      DOWN1: { x: 0, y: 0, w: 16, h: 16 },
      UP1: { x: 60, y: 0, w: 16, h: 16 },
      LEFT1: { x: 30, y: 0, w: 16, h: 16 },
      RIGHT1: { x: 90, y: 0, w: 16, h: 16 },
      DOWN2: { x: 0, y: 30, w: 16, h: 16 },
      UP2: { x: 60, y: 30, w: 16, h: 16 },
      LEFT2: { x: 30, y: 30, w: 16, h: 16 },
      RIGHT2: { x: 90, y: 30, w: 16, h: 16 },
    });
    this.playerAnim = new Animation(this.player, {
      StandUP: { steps: ['UP1'], duration: 1 / 10 },
      UP: { steps: ['UP1', 'UP2'], duration: 1 / 10 },
      StandLEFT: { steps: ['LEFT1'], duration: 1 / 10 },
      LEFT: { steps: ['LEFT1', 'LEFT2'], duration: 1 / 10 },
      StandRIGHT: { steps: ['RIGHT2'], duration: 1 / 10 },
      RIGHT: { steps: ['RIGHT1', 'RIGHT2'], duration: 1 / 10 },
      StandDOWN: { steps: ['DOWN1'], duration: 1 / 10 },
      DOWN: { steps: ['DOWN1', 'DOWN2'], duration: 1 / 10 },
    });
  }

  async render(ctx: CanvasRenderingContext2D, dT: number) {
    const aniId = (this.playerState.step === 0 ? 'Stand' : '') + this.playerState.direction;
    this.playerAnim.getSprite(aniId, dT).draw(ctx, {
      x: Math.floor(this.playerState.position.x * 16),
      y: Math.floor((4 + this.playerState.position.y) * 16 - 6),
    });

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';

      ctx.strokeRect(this.playerState.position.x * 16, 4 * 16 + this.playerState.position.y * 16 - 6, 16, 16);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.playerState.position.x * 16 + 2, 4 * 16 + this.playerState.position.y * 16, 12, 10);
    }
  }
}
