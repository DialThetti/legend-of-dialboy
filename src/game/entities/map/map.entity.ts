import { MapRenderer } from './map.renderer';
import { MapDefinition } from 'src/models/map-def';
import { MapState } from './map.state';
import { Entity } from '../../../core/entities/entity';

export class MapEntity implements Entity {
  state!: MapState;
  renderer!: MapRenderer;

  async load(mapDef: MapDefinition) {
    this.renderer = new MapRenderer(this);
    await this.renderer.load();
    this.state = {
      tiles: mapDef.tiles,
      color: mapDef.color,
      position: { x: 0, y: 0, z: 0 },
    };
  }
}
