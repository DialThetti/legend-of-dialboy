import { Sprite, SpriteSheet } from './spritesheet';

export class Animation {
  timer = 0;
  lastAnim!: string;
  constructor(
    private spriteSheet: SpriteSheet,
    private animationDef: { [key: string]: { steps: string[]; duration: number } }
  ) {}

  getSprite(id: string, dT: number): Sprite {
    if (this.lastAnim != id) {
      this.lastAnim = id;
      this.timer = 0;
    }
    const ani = this.animationDef[id];
    this.timer += dT;
    if (this.timer >= ani.steps.length * ani.duration) {
      this.timer -= ani.steps.length * ani.duration;
    }
    const idx = Math.floor(this.timer / ani.duration);
    const spriteId = ani.steps[idx];
    return this.spriteSheet.getSprite(spriteId) ?? (this.spriteSheet.getSprite(ani.steps[0]) as Sprite);
  }
}
