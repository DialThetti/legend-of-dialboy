import { loadImage } from '@core/load';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class SpriteSheet {
  sprites: { [key: string]: Sprite } = {};
  constructor(public img: HTMLImageElement, sprites: { [key: string]: Rect }) {
    Object.entries(sprites).forEach(([k, v]) => {
      this.sprites[k] = new Sprite(this, v);
    });
  }
  getSprite(name: string): Sprite | undefined {
    if (!this.sprites[name]) {
      console.warn(name + ' not a sprite');
      return undefined;
    }
    return this.sprites[name];
  }

  static async of(imgSrc: string, sprites: { [key: string]: Rect }): Promise<SpriteSheet> {
    const img = await loadImage(imgSrc);
    return new SpriteSheet(img, sprites);
  }
}

export class Sprite {
  constructor(private spriteSheet: SpriteSheet, private rect: Rect) {}
  draw(ctx: CanvasRenderingContext2D, position: { x: number; y: number }): void {
    ctx.drawImage(
      this.spriteSheet.img,
      this.rect.x,
      this.rect.y,
      this.rect.w,
      this.rect.h,
      position.x,
      position.y,
      this.rect.w,
      this.rect.h
    );
  }
}
