import { loadImage } from '@game/core/load';
import { MapEntity } from './map.entity';

export class MapRenderer {
  constructor(private entity: MapEntity) {}
  async load() {}

  render(ctx: CanvasRenderingContext2D, dT: number) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 256, 240);
    this.entity.tileMap.getChunk(this.entity.state.currentMapId).draw(ctx, { x: 0, y: 3 * 16 });
  }
  renderTop(ctx: CanvasRenderingContext2D, dT: number) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 256, 240);
    this.entity.tileMap.getChunk(this.entity.state.currentMapId, true).draw(ctx, { x: 0, y: 3 * 16 });
  }
}
