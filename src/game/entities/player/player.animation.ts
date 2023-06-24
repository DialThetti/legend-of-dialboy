import { Animation } from 'src/render/core/animation';
import { SpriteSheet } from 'src/render/core/spritesheet';

export class PlayerAnimation extends Animation {
  constructor(spriteSheet: SpriteSheet, animationDef: { [key: string]: { steps: string[]; duration: number } }) {
    super(spriteSheet, animationDef);
  }
  static async load(): Promise<PlayerAnimation> {
    const player = await SpriteSheet.of('./gfx/link.png', {
      DOWN1: { x: 0, y: 0, w: 16, h: 16 },
      UP1: { x: 60, y: 0, w: 16, h: 16 },
      LEFT1: { x: 30, y: 0, w: 16, h: 16 },
      RIGHT1: { x: 90, y: 0, w: 16, h: 16 },
      DOWN2: { x: 0, y: 30, w: 16, h: 16 },
      UP2: { x: 60, y: 30, w: 16, h: 16 },
      LEFT2: { x: 30, y: 30, w: 16, h: 16 },
      RIGHT2: { x: 90, y: 30, w: 16, h: 16 },
    });
    return new PlayerAnimation(player, {
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
}
