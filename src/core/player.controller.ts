import { Entity } from 'src/models/entity';
import { KeyListener } from './key-listener';
import { PlayerStateService } from './player-state.service';
import { MapLoaderService } from './map-loader.service';
import { PlayerCollider } from './player-collider';

export class PlayerController {
  blockTrigger = false;
  currentWalk?: string;
  speed = 1 / 10;
  constructor(
    private playerState: PlayerStateService,
    private keyListener: KeyListener,
    private mapLoader: MapLoaderService,
    private playerCollider: PlayerCollider
  ) {}

  // TODO make speed intependend from FrameRate
  async update(dT: number) {
    if (this.keyListener.keys.LEFT) {
      this.currentWalk = 'l';
      this.playerState.direction = 'LEFT';
      if (this.playerCollider.collidesWithTile(-this.speed, 0)) {
        return;
      }
      this.playerState.position.x -= this.speed;
      this.playerState.step += 1;
    } else if (this.keyListener.keys.RIGHT) {
      this.currentWalk = 'r';
      this.playerState.direction = 'RIGHT';
      if (this.playerCollider.collidesWithTile(+this.speed, 0)) {
        return;
      }
      this.playerState.position.x += this.speed;
      this.playerState.step += 1;
    } else if (this.keyListener.keys.UP) {
      this.currentWalk = 'u';
      this.playerState.direction = 'UP';
      if (this.playerCollider.collidesWithTile(0, -this.speed)) {
        return;
      }
      this.playerState.position.y -= this.speed;
      this.playerState.step += 1;
    } else if (this.keyListener.keys.DOWN) {
      this.currentWalk = 'd';
      this.playerState.direction = 'DOWN';
      if (this.playerCollider.collidesWithTile(0, this.speed)) {
        return;
      }
      this.playerState.position.y += this.speed;
      this.playerState.step += 1;
    } else {
      this.playerState.step = 0;
    }
    if (this.playerState.step > 10) {
      this.playerState.step -= 10;
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
    if (entity.traits.find(t => t.name === 'solid')) {
      if (this.currentWalk === 'l') {
        this.playerState.position.x += this.speed;
      }
      if (this.currentWalk === 'r') {
        this.playerState.position.x -= this.speed;
      }
      if (this.currentWalk === 'u') {
        this.playerState.position.y += this.speed;
      }
      if (this.currentWalk === 'd') {
        this.playerState.position.y -= this.speed;
      }
    }
    if (entity.traits.find(t => t.name == 'portal')) {
      const t = entity.traits.find(t => t.name == 'portal');
      this.playerState.position.x = t?.payload.position.x;
      this.playerState.position.y = t?.payload.position.y;
      this.playerState.map = await this.mapLoader.loadMap(t?.payload.map);
    }
    if (entity.traits.find(t => t.name === 'pickup')) {
      const t = entity.traits.find(t => t.name == 'pickup') as any;
      if (!t?.payload.respawn && !(this.playerState.inventory as any)[t.payload.id]) {
        (this.playerState.inventory as any)[t.payload.id] = true;
      }
    }
  }
}
