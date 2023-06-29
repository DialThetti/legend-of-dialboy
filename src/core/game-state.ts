import { MapEntity } from '../game/entities/map/map.entity';
import { PlayerEntity } from '../game/entities/player/player.entity';
import { Inventory } from '../models/inventory';
import { MapDefinition } from '../models/map-def';
import { Entity } from './entities/entity';

export class GameState {
  player!: PlayerEntity;
  mapEntity!: MapEntity;
  map!: MapDefinition;
  inventory: Inventory = { swordL1: false, rupees: 0, keys: 0, bombs: 0 };

  constructor() {
    (window as any).setRupees = (i: number) => (this.inventory.rupees = i);
    (window as any).setBombs = (i: number) => (this.inventory.bombs = i);
    (window as any).setKeys = (i: number) => (this.inventory.keys = i);
  }
  isSolidTile(p: { x: number; y: number }) {
    const tile = this.map.tiles[Math.floor(p.y)]?.[Math.floor(p.x)] ?? -1;
    if (tile == -1) {
      //   return true;
    }
    return this.map.properties.solid.includes(tile);
  }
  //TODO entities loaded here

  getEntities(): Entity[] {
    return [this.mapEntity, this.player];
  }
}
