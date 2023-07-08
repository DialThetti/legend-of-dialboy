import { GameState } from '../../core/game-state';
import { SpriteSheet } from './core/spritesheet';

export class HUDRenderer {
  state!: GameState;
  spriteSheet!: SpriteSheet;
  async load(mapState: GameState) {
    const sprites = {
      fullHeart: { x: 627, y: 117, w: 8, h: 8 },
      halfHeart: { x: 627 + 9, y: 117, w: 8, h: 8 },
      emptyHeart: { x: 627 + 9 + 9, y: 117, w: 8, h: 8 },
      x: { x: 519, y: 117, w: 8, h: 8 },
      back: { x: 258, y: 11, w: 256, h: 56 },
    } as any;

    for (let i = 0; i < 10; i++) {
      sprites[i] = { x: 519 + 9 + 9 * i, y: 117, w: 8, h: 8 };
    }
    this.spriteSheet = await SpriteSheet.of('./gfx/pausescreen.png', sprites);
    this.state = mapState;
  }

  render(ctx: CanvasRenderingContext2D, dT: number) {
    return;
    this.spriteSheet.getSprite('back')?.draw(ctx, { x: 0, y: 0 });
    this.renderHearts(ctx);
    this.renderItems(ctx);
  }

  renderItems(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(96, 0, 24, 16 * 3);
    const { rupees, keys, bombs } = this.state.inventory;

    const rSplit = this.getStringByNumber(rupees, 3);
    for (let i = 0; i < rSplit.length; i++) {
      this.spriteSheet.getSprite(rSplit[i])?.draw(ctx, { x: 96 + 8 * i, y: 16 });
    }
    const kSplit = this.getStringByNumber(keys, 2);
    for (let i = 0; i < kSplit.length; i++) {
      this.spriteSheet.getSprite(kSplit[i])?.draw(ctx, { x: 96 + 8 * i, y: 32 });
    }
    const bSplit = this.getStringByNumber(bombs, 2);
    for (let i = 0; i < bSplit.length; i++) {
      this.spriteSheet.getSprite(bSplit[i])?.draw(ctx, { x: 96 + 8 * i, y: 40 });
    }
  }
  renderHearts(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(176, 32, 64, 16);
    const fullH = Math.floor(this.state.player.state.hearts.current);
    const emptyH = this.state.player.state.hearts.max;
    for (let h = 0; h < fullH; h++) {
      this.spriteSheet.getSprite('emptyHeart')?.draw(ctx, this.heartPos(h));
    }
    if (Math.floor(this.state.player.state.hearts.current) != Math.ceil(this.state.player.state.hearts.current)) {
      this.spriteSheet
        .getSprite('halfHeart')
        ?.draw(ctx, this.heartPos(Math.floor(this.state.player.state.hearts.current)));
    }
    for (let h = Math.ceil(this.state.player.state.hearts.current); h < emptyH; h++) {
      this.spriteSheet.getSprite('fullHeart')?.draw(ctx, this.heartPos(h));
    }
  }

  getStringByNumber(x: number, digits: number): string[] {
    let rStr = `${x}`;
    if (digits === 3) {
      if (rStr.length == 1) {
        rStr = '0' + rStr;
      }
      if (rStr.length == 2) {
        rStr = 'x' + rStr;
      }
    }
    if (digits === 2) {
      if (rStr.length == 1) {
        rStr = 'x' + rStr;
      }
    }
    return rStr.split('');
  }
  heartPos(id: number): { x: number; y: number } {
    return {
      x: 176 + id * 8 - Math.floor(id / 8) * 64,
      y: 40 - Math.floor(id / 8) * 8,
    };
  }
}
