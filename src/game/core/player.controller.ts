import { KeyListener } from './key-listener';
import { GameState } from './game-state';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { PlayerState } from '../entities/player/player.state';

export class PlayerController {
  blockTrigger = false;
  speed = 1 / 15;
  constructor(private gameState: GameState, private player: PlayerEntity, private keyListener: KeyListener) {}

  async update(dT: number) {
    const { state } = this.player;
    if (state.presentItem) {
      return;
    }
    this.player.state.ghost = this.keyListener.keys.debug;
    this.setMovementByKeys(state);
    this.mapTransition();
  }

  private setMovementByKeys(state: PlayerState) {
    if (this.keyListener.keys.LEFT) {
      state.direction = 'LEFT';
      state.velocity = { x: -1, y: 0 };
      state.step += 1;
    } else if (this.keyListener.keys.RIGHT) {
      state.velocity = { x: 1, y: 0 };
      state.direction = 'RIGHT';

      state.step += 1;
    } else if (this.keyListener.keys.UP) {
      state.direction = 'UP';
      state.velocity = { x: 0, y: -1 };

      state.step += 1;
    } else if (this.keyListener.keys.DOWN) {
      state.direction = 'DOWN';
      state.velocity = { x: 0, y: 1 };
      state.step += 1;
    } else {
      state.step = 0;
      state.velocity = { x: 0, y: 0 };
    }
    if (state.step > 10) {
      state.step -= 10;
    }
  }

  async mapTransition(): Promise<void> {
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
