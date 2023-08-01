import { GameState } from '../../core/game-state';
import { Math2d } from '../../core/math/math-2d';
import { Point2d } from '../../core/math/point-2d';
import BoundingBox from '../../core/math/rectangle';
import { GrassEntity } from '../grass/grass.entity';
import { PlayerEntity } from '../player/player.entity';
import { SlimeEntity } from '../slime/slime.entity';
import { MapRenderer } from './map.renderer';
import { MapState } from './map.state';
import { Entity } from '@game/core/entities/entity';
import { TilesBasedMap } from '@game/core/tiles/tilesbased-map';

export class MapEntity implements Entity {
  state!: MapState;
  renderer!: MapRenderer;
  tileMap!: TilesBasedMap;
  constructor(private gameState: GameState) {}

  async load(map = 'overworld') {
    this.tileMap = await TilesBasedMap.load(`./tiled/${map}.map.json`);
    this.renderer = new MapRenderer(this);
    await this.renderer.load();
    this.state = {
      position: { x: 0, y: 0, z: 0 },
      currentMapId: '8c',
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
          await this.load(payload.map);
          this.state.currentMapId = payload.mapId;

          await this.loadChunk();
          p.state.position = { x: payload.x, y: payload.y, z: p.state.position.z };
          break;
        case 'entity':
          break;
        default:
          console.log(obj);
      }
    }
  }

  async interact(p: PlayerEntity): Promise<boolean> {
    const c = this.tileMap.getChunk(this.state.currentMapId);

    const target = { x: p.hitBox.pos.x, y: p.hitBox.pos.y };
    switch (p.state.direction) {
      case 'DOWN':
        target.y += 1;
        break;
      case 'UP':
        target.y -= 1;
        break;
      case 'LEFT':
        target.x -= 1;
        break;
      case 'RIGHT':
        target.x += 1;
        break;
    }

    const obj = c.obj.find(o =>
      new BoundingBox({ x: o.x, y: o.y }, { x: o.width, y: o.height }).overlaps(new BoundingBox(target, { x: 1, y: 1 }))
    );
    if (obj) {
      const payload = JSON.parse((obj.properties.find(p => p.name === 'payload')?.value as string) ?? '{}');
      switch (obj.properties.find(p => p.name === 'type')?.value) {
        case 'dialog':
          this.gameState.pause = true;
          this.gameState.dialog = payload.text;

          return true;
        case 'entity':
          break;
        default:
          console.log(obj);
      }
    }
    return false;
  }

  async loadChunk() {
    const c = this.tileMap
      .getChunk(this.state.currentMapId)
      .obj.filter(o => o.properties.find(p => p.name === 'type')?.value === 'entity')
      .map(o => ({
        ...o,
        payload: JSON.parse((o.properties.find(p => p.name === 'payload')?.value as string) ?? '{}'),
      }));
    const x = (await Promise.all(
      c
        .map(async e => {
          switch (e.payload.entityType.split(':')[0]) {
            case 'grass': {
              const g = new GrassEntity();
              await g.load(e);
              return g;
            }
            case 'slime': {
              const color = e.payload.entityType.split(':')[1];
              const s = new SlimeEntity(this.gameState);

              await s.load({
                position: { x: e.x, y: e.y, z: 5 },
                direction: 'DOWN',
                color: color as any,
                velocity: { x: 0, y: 0 },
                speed: ({ GREEN: 1, RED: 1.5, BLUE: 2, VIOLET: 3 } as any)[color] ?? 1,
                sleepTime: ({ GREEN: 1, RED: 0.75, BLUE: 0.5, VIOLET: 0 } as any)[color] ?? 1,
              });
              return s;
            }
          }
        })
        .filter(e => e)
    )) as Entity[];
    this.gameState.entities = x;
  }
}
