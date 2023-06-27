import { Entity } from 'src/models/entity';
import { KeyListener } from './key-listener';
import { MapState } from './map-state';
import { MapLoaderService } from './map-loader.service';
import { PlayerCollider } from './player-collider';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';

export class PlayerController {
  blockTrigger = false;
  currentWalk?: string;
  speed = 1 / 10;
  constructor(
    private playerState: MapState,
    private player: PlayerEntity,
    private keyListener: KeyListener,
    private mapLoader: MapLoaderService,
    private playerCollider: PlayerCollider
  ) {}

  // TODO make speed intependend from FrameRate
  async update(dT: number) {
    this.player.update(dT);
    const { state } = this.player;
    if (state.presentItem) {
      return;
    }
    if (this.keyListener.keys.LEFT) {
      this.currentWalk = 'l';
      state.direction = 'LEFT';
      if (this.playerCollider.collidesWithTile(-this.speed, 0)) {
        return;
      }
      state.position.x -= this.speed;
      state.step += 1;
    } else if (this.keyListener.keys.RIGHT) {
      this.currentWalk = 'r';
      state.direction = 'RIGHT';
      if (this.playerCollider.collidesWithTile(+this.speed, 0)) {
        return;
      }
      state.position.x += this.speed;
      state.step += 1;
    } else if (this.keyListener.keys.UP) {
      this.currentWalk = 'u';
      state.direction = 'UP';
      if (this.playerCollider.collidesWithTile(0, -this.speed)) {
        return;
      }
      state.position.y -= this.speed;
      state.step += 1;
    } else if (this.keyListener.keys.DOWN) {
      this.currentWalk = 'd';
      state.direction = 'DOWN';
      if (this.playerCollider.collidesWithTile(0, this.speed)) {
        return;
      }
      state.position.y += this.speed;
      state.step += 1;
    } else {
      state.step = 0;
    }
    if (state.step > 10) {
      state.step -= 10;
    }
    this.checkCollide();
  }

  async checkCollide(): Promise<void> {
    if (this.blockTrigger) {
      return;
    }

    this.playerState.map.entities
      .filter(entity => this.playerCollider.collidesWithEntity(entity))
      .forEach(entity => this.handleCollide(entity));
  }

  async handleCollide(entity: Entity): Promise<void> {
    const { state } = this.player;
    if (entity.traits.find(t => t.name === 'solid')) {
      if (this.currentWalk === 'l') {
        state.position.x += this.speed;
      }
      if (this.currentWalk === 'r') {
        state.position.x -= this.speed;
      }
      if (this.currentWalk === 'u') {
        state.position.y += this.speed;
      }
      if (this.currentWalk === 'd') {
        state.position.y -= this.speed;
      }
    }
    if (entity.traits.find(t => t.name == 'portal')) {
      const t = entity.traits.find(t => t.name == 'portal');
      state.position.x = t?.payload.position.x;
      state.position.y = t?.payload.position.y;
      this.playerState.map = await this.mapLoader.loadMap(t?.payload.map);
      this.playerState.mapEntity = new MapEntity();
      await this.playerState.mapEntity.load(this.playerState.map);
    }
    if (entity.traits.find(t => t.name === 'pickup')) {
      const t = entity.traits.find(t => t.name == 'pickup') as any;
      if (!t?.payload.respawn && !(this.playerState.inventory as any)[t.payload.id]) {
        state.presentItem = { item: t.payload.id, timer: 1.5 };
        (this.playerState.inventory as any)[t.payload.id] = true;
      }
    }
  }
}
