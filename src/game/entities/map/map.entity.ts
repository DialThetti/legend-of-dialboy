import { MapRenderer } from './map.renderer';
import { MapDefinition } from 'src/models/map-def';
import { MapState } from './map.state';

export class MapEntity {
  state!: MapState;
  renderer!: MapRenderer;

  async load(mapDef: MapDefinition) {
    this.renderer = new MapRenderer(this);
    await this.renderer.load();
    this.state = {
      tiles: mapDef.tiles,
      color: mapDef.color,
    };
  }
}
