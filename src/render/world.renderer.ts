import { loadImage } from '@core/load';
import { MapState } from '@core/map-state';

export class WorldRenderer {
  tiles!: HTMLImageElement;

  constructor(private playerState: MapState) {}
  async load() {
    this.tiles = await loadImage('./gfx/tiles-overworld.png');
  }

  drawWorld(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgb(20,20,20)';
    ctx.fillRect(0, 0, 256, 240);
    for (let x = 0; x < this.playerState.map.tiles.length; x++) {
      for (let y = 0; y < this.playerState.map.tiles[x].length; y++) {
        ctx.drawImage(
          this.tiles,
          ((this.playerState.map.tiles[x][y] % 6) + 6 * this.playerState.map.color) * (16 + 1) + 1,
          Math.floor(this.playerState.map.tiles[x][y] / 6) * (16 + 1) + 1,
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
