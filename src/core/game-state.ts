import { MapEntity } from '../game/entities/map/map.entity';
import { PlayerEntity } from '../game/entities/player/player.entity';
import { Inventory } from '../models/inventory';
import { Entity } from './entities/entity';

export class GameState {
  player!: PlayerEntity;
  mapEntity!: MapEntity;
  inventory: Inventory = { swordL1: false, rupees: 0, keys: 0, bombs: 0 };

  constructor() {
    (window as any).setRupees = (i: number) => (this.inventory.rupees = i);
    (window as any).setBombs = (i: number) => (this.inventory.bombs = i);
    (window as any).setKeys = (i: number) => (this.inventory.keys = i);
  }
  isSolidTile(p: { x: number; y: number }): boolean {
    if (this.player.state.ghost) {
      return false;
    }
    return this.mapEntity.tileMap.getChunk(this.mapEntity.state.currentMapId).isSolid(p);
  }
  //TODO entities loaded here

  getEntities(): Entity[] {
    return [this.mapEntity, this.player];
  }
}
