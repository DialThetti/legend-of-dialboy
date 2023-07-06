import { MapEntity } from '../game/entities/map/map.entity';
import { PlayerEntity } from '../game/entities/player/player.entity';
import { SlimeEntity } from '../game/entities/slime/slime.entity';
import { Inventory } from '../models/inventory';
import { Entity } from './entities/entity';

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

  async load() {
    let x = 5;
    let y = 0;
    for (let index = 0; index < 6; index++) {
      const s = new SlimeEntity(this);
      this.entities.push(s);
      await s.load({
        position: { x, y, z: 5 },
        direction: 'DOWN',
        color: ['GREEN', 'RED', 'BLUE', 'VIOLET'][Math.floor(Math.random() * 4)] as any,
      });
      x++;
      if (x == 8) {
        x = 5;
        y++;
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
