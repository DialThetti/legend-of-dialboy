import { Animation } from '../../render/core/animation';
import { SpriteSheet } from '../../render/core/spritesheet';
import DEFAULT_ANIMATION from '../../render/core/ani3.default.json';
import DEFAULT_SPRITESHEET from '../../render/core/spritesheet.default.json';

export class PlayerAnimation extends Animation {
  constructor(spriteSheet: SpriteSheet, animationDef: { [key: string]: { steps: string[]; duration: number } }) {
    super(spriteSheet, animationDef);
  }
  static async load(): Promise<PlayerAnimation> {
    const player = await SpriteSheet.of('./gfx/chars/Character 1.png', DEFAULT_SPRITESHEET);
    return new PlayerAnimation(player, DEFAULT_ANIMATION);
  }
}
