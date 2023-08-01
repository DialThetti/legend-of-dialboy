import { Entity } from '../../core/entities/entity';
import { EntityRenderer } from '../../core/entities/entity.renderer';
import { EntityState } from '../../core/entities/entity.state';
import { Point2d } from '../../core/math/point-2d';
import BoundingBox from '../../core/math/rectangle';
import { SpriteSheet } from '../../render/core/spritesheet';

export class GrassEntity implements Entity {
  state!: GrassState;
  renderer!: GrassRenderer;

  async load(pos: Point2d) {
    this.renderer = new GrassRenderer(this);
    await this.renderer.load();
    this.state = {
      position: { z: 0, x: Math.round(pos.x), y: Math.round(pos.y) },
      velocity: { x: 0, y: 0 },
      direction: 'DOWN',
    };
  }

  update(dt: number): void {}
  get hitBox(): BoundingBox {
    return new BoundingBox(this.state.position, { x: 1, y: 1 });
  }
}

interface GrassState extends EntityState {}

class GrassRenderer implements EntityRenderer {
  spritesheet!: SpriteSheet;
  constructor(private entity: GrassEntity) {}
  async load() {
    this.spritesheet = await SpriteSheet.of('./gfx/16x16/RGW_Forest.png', {
      grass: { x: 16 * 28, y: 16, w: 16, h: 16 },
    });
  }
  render(ctx: CanvasRenderingContext2D, dT: number): void {
    //ctx.strokeStyle = 'green';
    this.spritesheet
      .getSprite('grass')
      ?.draw(ctx, { x: this.entity.state.position.x * 16, y: this.entity.state.position.y * 16 + 3 * 16 });
    //  ctx.strokeRect(this.entity.state.position.x * 16, this.entity.state.position.y * 16 + 3 * 16, 16, 16);
  }
}
