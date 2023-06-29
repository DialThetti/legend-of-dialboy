import { loadImage } from '@core/load';
import { MapEntity } from './map.entity';

export class MapRenderer {
  tiles!: HTMLImageElement;
  constructor(private entity: MapEntity) {}
  async load() {
    this.tiles = await loadImage('./gfx/tiles-overworld.png');
  }

  render(ctx: CanvasRenderingContext2D, dT: number) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 256, 240);
    for (let x = 0; x < this.entity.state.tiles.length; x++) {
      for (let y = 0; y < this.entity.state.tiles[x].length; y++) {
        ctx.drawImage(
          this.tiles,
          ((this.entity.state.tiles[x][y] % 6) + 6 * this.entity.state.color) * (16 + 1) + 1,
          Math.floor(this.entity.state.tiles[x][y] / 6) * (16 + 1) + 1,
          16,
          16,
          y * 16,
          4 * 16 + x * 16,
          16,
          16
        );
      }
    }
  }
}
