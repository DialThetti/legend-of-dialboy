import { Inventory } from 'src/models/inventory';
import { Tileset } from '../models/tileset';
import { PlayerEntity } from '@game/entities/player/player.entity';

export class MapState {
  player!: PlayerEntity;
  map!: Tileset;
  inventory: Inventory = { swordL1: false, rupees: 0 };

  isSolidTile(p: { x: number; y: number }) {
    const tile = this.map.tiles[Math.floor(p.y)]?.[Math.floor(p.x)] ?? -1;
    if (tile == -1) {
      //   return true;
    }
    return this.map.properties.solid.includes(tile);
  }
  //TODO entities loaded here
}
