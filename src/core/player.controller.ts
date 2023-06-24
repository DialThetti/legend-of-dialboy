import { Entity } from 'src/models/entity';
import { KeyListener } from './key-listener';
import { MapState } from './map-state';
import { MapLoaderService } from './map-loader.service';
import { PlayerCollider } from './player-collider';
import { PlayerEntity } from '@game/entities/player/player.entity';

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
    if (this.keyListener.keys.LEFT) {
      this.currentWalk = 'l';
      this.player.state.direction = 'LEFT';
      if (this.playerCollider.collidesWithTile(-this.speed, 0)) {
        return;
      }
      this.player.state.position.x -= this.speed;
      this.player.state.step += 1;
    } else if (this.keyListener.keys.RIGHT) {
      this.currentWalk = 'r';
      this.player.state.direction = 'RIGHT';
      if (this.playerCollider.collidesWithTile(+this.speed, 0)) {
        return;
      }
      this.player.state.position.x += this.speed;
      this.player.state.step += 1;
    } else if (this.keyListener.keys.UP) {
      this.currentWalk = 'u';
      this.player.state.direction = 'UP';
      if (this.playerCollider.collidesWithTile(0, -this.speed)) {
        return;
      }
      this.player.state.position.y -= this.speed;
      this.player.state.step += 1;
    } else if (this.keyListener.keys.DOWN) {
      this.currentWalk = 'd';
      this.player.state.direction = 'DOWN';
      if (this.playerCollider.collidesWithTile(0, this.speed)) {
        return;
      }
      this.player.state.position.y += this.speed;
      this.player.state.step += 1;
    } else {
      this.player.state.step = 0;
    }
    if (this.player.state.step > 10) {
      this.player.state.step -= 10;
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
        this.player.state.position.x += this.speed;
      }
      if (this.currentWalk === 'r') {
        this.player.state.position.x -= this.speed;
      }
      if (this.currentWalk === 'u') {
        this.player.state.position.y += this.speed;
      }
      if (this.currentWalk === 'd') {
        this.player.state.position.y -= this.speed;
      }
    }
    if (entity.traits.find(t => t.name == 'portal')) {
      const t = entity.traits.find(t => t.name == 'portal');
      this.player.state.position.x = t?.payload.position.x;
      this.player.state.position.y = t?.payload.position.y;
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
