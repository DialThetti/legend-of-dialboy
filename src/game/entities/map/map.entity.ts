import { MapRenderer } from './map.renderer';
import { MapState } from './map.state';
import { Entity } from '../../../core/entities/entity';
import { TilesBasedMap } from '../../../core/tiles/tilesbased-map';

export class MapEntity implements Entity {
  state!: MapState;
  renderer!: MapRenderer;
  tileMap!: TilesBasedMap;

  async load() {
    this.tileMap = await TilesBasedMap.load('./tiled/forest.map.json');
    this.renderer = new MapRenderer(this);
    await this.renderer.load();
    this.state = {
      position: { x: 0, y: 0, z: 0 },
      currentMapId: '8d',
      direction: 'DOWN',
    };
  }
  update(dt: number): void {}
}
