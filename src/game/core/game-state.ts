import { MapEntity } from '../entities/map/map.entity';
import { PlayerEntity } from '../entities/player/player.entity';
import { SlimeEntity } from '../entities/slime/slime.entity';
import { Entity } from './entities/entity';
import BoundingBox from './math/rectangle';

export class GameState {
  player!: PlayerEntity;
  mapEntity!: MapEntity;
  inventory: Inventory = { swordL1: false, rupees: 0, keys: 0, bombs: 0 };

  entities: Entity[] = [];
  constructor() {
    (window as any).setRupees = (i: number) => (this.inventory.rupees = i);
    (window as any).setBombs = (i: number) => (this.inventory.bombs = i);
    (window as any).setKeys = (i: number) => (this.inventory.keys = i);
  }

  async load() {}

  async loadChunk(id: string) {
    this.entities = [];
    if (id === '8d') {
      let x = 5;
      let y = 0;
      for (let index = 0; index < 0; index++) {
        const color = ['GREEN', 'RED', 'BLUE', 'VIOLET'][Math.floor(Math.random() * 4)];
        const s = new SlimeEntity(this);
        this.entities.push(s);
        await s.load({
          position: { x, y, z: 5 },
          direction: 'DOWN',
          color: color as any,
          velocity: { x: 0, y: 0 },
          speed: { GREEN: 1, RED: 1.5, BLUE: 2, VIOLET: 3 }[color] ?? 1,
          sleepTime: { GREEN: 1, RED: 0.75, BLUE: 0.5, VIOLET: 0 }[color] ?? 1,
        });
        x++;
        if (x == 8) {
          x = 5;
          y++;
        }
      }
    }
  }

  isSolidTile(p: { x: number; y: number }): boolean {
    if (this.player.state.ghost) {
      return false;
    }
    const solidTile = this.mapEntity.tileMap.getChunk(this.mapEntity.state.currentMapId).isSolid(p);

    const solid = solidTile;
    return solid;
  }
  //TODO entities loaded here

  getEntities(): Entity[] {
    return [this.mapEntity, this.player, ...this.entities];
  }
}

export interface Inventory {
  swordL1: boolean;
  rupees: number;
  keys: number;
  bombs: number;
}
