import { Inventory } from 'src/models/inventory';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapDefinition } from 'src/models/map-def';
import { MapEntity } from '@game/entities/map/map.entity';

export class MapState {
  player!: PlayerEntity;
  mapEntity!: MapEntity;
  map!: MapDefinition;
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
