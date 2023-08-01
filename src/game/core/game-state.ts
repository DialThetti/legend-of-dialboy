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
