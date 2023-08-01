import { Entity } from './entities/entity';
import { GameState } from './game-state';
import { Point2d } from './math/point-2d';

export class TileCollider {
  t: Point2d[] = [];
  constructor(private gameState: GameState) {}

  collidesWithTiles(entity: Entity): Point2d[] {
    let possibleTiles: Point2d[] = [];
    const { top, bottom, left, right } = entity.hitBox;
    if (entity.state.velocity.y < 0)
      possibleTiles = [
        { x: Math.floor(left), y: Math.floor(top) },
        { x: Math.floor(right), y: Math.floor(top) },
      ];
    else if (entity.state.velocity.y > 0)
      possibleTiles = [
        { x: Math.floor(left), y: Math.floor(bottom) },
        { x: Math.floor(right), y: Math.floor(bottom) },
      ];
    else if (entity.state.velocity.x < 0)
      possibleTiles = [
        { x: Math.floor(left), y: Math.floor(top) },
        { x: Math.floor(left), y: Math.floor(bottom) },
      ];
    else if (entity.state.velocity.x > 0)
      possibleTiles = [
        { x: Math.floor(right), y: Math.floor(top) },
        { x: Math.floor(right), y: Math.floor(bottom) },
      ];
    this.t = possibleTiles.filter(p => this.gameState.isSolidTile(p));
    return this.t;
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'red';
    this.t.forEach(tile => {
      ctx.strokeRect(16 * tile.x + 1, 16 * 3 + 16 * tile.y + 1, 14, 14);
    });
    this.t = [];
  }
}
