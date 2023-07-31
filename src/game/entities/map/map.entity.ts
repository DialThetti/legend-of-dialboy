import { Math2d } from '../../core/math/math-2d';
import { Point2d } from '../../core/math/point-2d';
import BoundingBox from '../../core/math/rectangle';
import { PlayerEntity } from '../player/player.entity';
import { MapRenderer } from './map.renderer';
import { MapState } from './map.state';
import { Entity } from '@game/core/entities/entity';
import { TilesBasedMap } from '@game/core/tiles/tilesbased-map';

export class MapEntity implements Entity {
  state!: MapState;
  renderer!: MapRenderer;
  tileMap!: TilesBasedMap;

  async load(map = 'overworld') {
    this.tileMap = await TilesBasedMap.load(`./tiled/${map}.map.json`);
    this.renderer = new MapRenderer(this);
    await this.renderer.load();
    this.state = {
      position: { x: 0, y: 0, z: 0 },
      currentMapId: '8d',
      velocity: { x: 0, y: 0 },
      direction: 'DOWN',
    };
  }
  update(dt: number): void {}
  get hitBox(): BoundingBox {
    return new BoundingBox({ x: 0, y: 0 }, { x: 0, y: 0 });
  }

  async collidesWithEvent(p: PlayerEntity) {
    const c = this.tileMap.getChunk(this.state.currentMapId);
    const obj = c.obj.find(o => new BoundingBox({ x: o.x, y: o.y }, { x: o.width, y: o.height }).overlaps(p.hitBox));
    if (obj) {
      const payload = JSON.parse((obj.properties.find(p => p.name === 'payload')?.value as string) ?? '{}');
      switch (obj.properties.find(p => p.name === 'type')?.value) {
        case 'teleport':
          console.log(payload);
          await this.load(payload.map);
          this.state.currentMapId = payload.mapId;
          p.state.position = { x: payload.x, y: payload.y, z: p.state.position.z };
          break;
        default:
          console.log(obj);
      }
    }
  }
}
