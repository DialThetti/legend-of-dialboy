import { Inventory } from 'src/models/inventory';
import { Tileset } from '../models/tileset';

export class PlayerStateService {
  direction = 'UP';
  position = { x: 5, y: 5 };
  map!: Tileset;
  step = 0;
  inventory: Inventory = { swordL1: false, rupees: 0 };

  isSolidTile(p: { x: number; y: number }) {
    const tile = this.map.tiles[Math.floor(p.y)]?.[Math.floor(p.x)] ?? -1;
    if (tile == -1) {
      //   return true;
    }
    return this.map.properties.solid.includes(tile);
  }
}
