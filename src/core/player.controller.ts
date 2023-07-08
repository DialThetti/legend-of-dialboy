import { KeyListener } from './key-listener';
import { GameState } from './game-state';
import { PlayerCollider } from './player-collider';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';
import { Entity } from './entities/entity';

export class PlayerController {
  blockTrigger = false;
  currentWalk?: string;
  speed = 1 / 15;
  constructor(
    private gameState: GameState,
    private player: PlayerEntity,
    private keyListener: KeyListener,
    private playerCollider: PlayerCollider
  ) {}

  // TODO make speed intependend from FrameRate
  async update(dT: number) {
    const { state } = this.player;
    if (state.presentItem) {
      return;
    }
    this.player.state.ghost = this.keyListener.keys.debug;
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

    if (this.player.state.position.x < -0.5) {
      this.player.state.position.x += 15.5;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) - 1).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.loadChunk(newMapId);
    } else if (this.player.state.position.x > 15.5) {
      this.player.state.position.x -= 15.5;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) + 1).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.loadChunk(newMapId);
    } else if (this.player.state.position.y < -0.5) {
      this.player.state.position.y += 11.5;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) - 16).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.loadChunk(newMapId);
    } else if (this.player.state.position.y > 11.5) {
      this.player.state.position.y -= 12;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) + 16).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.loadChunk(newMapId);
    }
  }
}
