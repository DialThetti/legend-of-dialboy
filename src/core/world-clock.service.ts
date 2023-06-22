import { Entity } from 'src/models/entity';
import { KeyListener } from './key-listener';
import { PlayerStateService } from './player-state.service';
import { loadJson } from './load';
import { Tileset } from 'src/models/tileset';
import { MapLoaderService } from './map-loader.service';

export class WorldClock {
  blockTrigger = false;
  currentWalk?: string;
  constructor(
    private playerState: PlayerStateService,
    private keyListener: KeyListener,
    private mapLoader: MapLoaderService
  ) {}

  async update() {
    if (this.currentWalk) {
      switch (this.currentWalk) {
        case 'u':
          this.playerState.position.y -= 1 / 10;
          this.playerState.direction = 'UP';
          break;
        case 'd':
          this.playerState.position.y += 1 / 10;
          this.playerState.direction = 'DOWN';
          break;
        case 'l':
          this.playerState.position.x -= 1 / 10;
          this.playerState.direction = 'LEFT';
          break;
        case 'r':
          this.playerState.position.x += 1 / 10;
          this.playerState.direction = 'RIGHT';
          break;
      }
      this.playerState.step--;
      if (this.playerState.step == 0) {
        this.currentWalk = undefined;
        this.blockTrigger = false;
        this.playerState.position.x = Math.round(this.playerState.position.x);
        this.playerState.position.y = Math.round(this.playerState.position.y);
      }
    } else {
      const { x, y } = this.playerState.position;
      if (this.keyListener.keys.LEFT) {
        if (this.playerState.isSolidTile({ x: x - 1, y })) {
          return;
        }
        this.currentWalk = 'l';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.RIGHT) {
        if (this.playerState.isSolidTile({ x: x + 1, y })) {
          return;
        }
        this.currentWalk = 'r';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.UP) {
        if (this.playerState.isSolidTile({ x, y: y - 1 })) {
          return;
        }
        this.currentWalk = 'u';
        this.playerState.step = 10;
      } else if (this.keyListener.keys.DOWN) {
        if (this.playerState.isSolidTile({ x, y: y + 1 })) {
          return;
        }
        this.currentWalk = 'd';
        this.playerState.step = 10;
      }
    }

    this.checkCollide();
  }
  async checkCollide() {
    if (this.blockTrigger) {
      return;
    }
    let { x, y } = this.playerState.position;
    x *= 16;
    y *= 16;
    y -= 6;
    this.playerState.map.entities.forEach(entity => {
      const ex = entity.position.x * 16;
      const ey = entity.position.y * 16;

      if (ex <= x && x <= ex + entity.size.width) {
        if (ey <= y && y <= ey + entity.size.height) {
          this.handleCollide(entity);
        }
      }
      if (ex <= x && x <= ex + entity.size.width) {
        if (ey <= y + 16 && y + 16 <= ey + entity.size.height) {
          this.handleCollide(entity);
        }
      }
    });
  }
  async handleCollide(entity: Entity) {
    if (entity.traits.find(t => t.name == 'portal')) {
      const t = entity.traits.find(t => t.name == 'portal');
      this.playerState.position.x = t?.payload.position.x;
      this.playerState.position.y = t?.payload.position.y;
      this.playerState.map = await this.mapLoader.loadMap(t?.payload.map);
      this.blockTrigger = true;
    }
  }
}
