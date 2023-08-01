import { KeyListener } from './key-listener';
import { GameState, items } from './game-state';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { PlayerState } from '../entities/player/player.state';
import BoundingBox from './math/rectangle';
import { Math2d } from './math/math-2d';

export class PlayerController {
  blockTrigger = false;
  speed = 1 / 15;

  weaponChanged = false;
  constructor(private gameState: GameState, private player: PlayerEntity, private keyListener: KeyListener) {}

  async update(dT: number) {
    const { state } = this.player;
    if (state.presentItem) {
      return;
    }
    this.player.state.ghost = this.keyListener.keys.debug;
    this.setMovementByKeys(state);
    this.mapTransition();
    if (this.keyListener.keys.SELECT) {
      if (!this.weaponChanged) {
        let i = items.findIndex(k => k === this.gameState.inventory.equippedA) + 1;
        if (i >= items.length) {
          i = 0;
        }
        this.gameState.inventory.equippedA = items[i];
        this.weaponChanged = true;
      }
    } else {
      this.weaponChanged = false;
    }
  }

  private setMovementByKeys(state: PlayerState) {
    if (this.gameState.pause) {
      if (!this.keyListener.isPressedObserver) {
        this.keyListener.isPressedObserver = (e: KeyboardEvent) => {
          if (e.key === ' ') {
            this.gameState.pause = false;
            delete this.gameState.dialog;
          }
          return false;
        };
      }
      return;
    }
    if (state.forcedWay != 0) {
      return;
    }
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

    if (this.keyListener.keys.A) {
      switch (this.gameState.inventory.equippedA) {
        case 'Sword':
          state.attack = SwordAttack.get(this.player);

          break;
        case 'Dash':
          state.attack = DashAttack.get(this.player);

          break;
      }
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
      await this.gameState.mapEntity.loadChunk();
    } else if (this.player.state.position.x > 15.5) {
      this.player.state.position.x -= 15.5;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) + 1).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.mapEntity.loadChunk();
    } else if (this.player.state.position.y < -0.5) {
      this.player.state.position.y += 11.5;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) - 16).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.mapEntity.loadChunk();
    } else if (this.player.state.position.y > 11.5) {
      this.player.state.position.y -= 12;
      const mapId = this.gameState.mapEntity.state.currentMapId;
      const newMapId = (parseInt(mapId, 16) + 16).toString(16);
      this.gameState.mapEntity.state.currentMapId = newMapId;
      await this.gameState.mapEntity.loadChunk();
    }
  }
}

class DashAttack {
  static get(player: PlayerEntity) {
    if (player.state.attack) {
      return player.state.attack;
    }
    let dir;
    switch (player.state.direction) {
      case 'RIGHT':
        dir = { x: 1, y: 0 };
        break;
      case 'LEFT':
        dir = { x: -1, y: 0 };
        break;
      case 'UP':
        dir = { x: 0, y: -1 };
        break;
      case 'DOWN':
        dir = { x: 0, y: 1 };
        break;
    }

    const speed = 5;
    player.state.forcedWay = 1 / (3 * speed);
    player.state.velocity = Math2d.scale(dir, speed);
    return {
      timer: 1 / (3 * speed) + 0.2,
      area: [player.hitBox],
      properties: ['invicible'],
      next: {
        timer: 1,
        area: [],
        properties: ['cooldown'],
      },
    };
  }
}
class SwordAttack {
  static get(player: PlayerEntity) {
    let s = { x: 0, y: 0 };
    let o = { x: 0, y: 0 };
    switch (player.state.direction) {
      case 'RIGHT':
        o = { x: 1, y: 0 };
        break;
      case 'LEFT':
        s = { x: -1, y: 0 };
        o = { x: 1, y: 0 };
        break;
      case 'UP':
        s = { x: 0, y: -1 };
        o = { x: 0, y: 1 };
        break;
      case 'DOWN':
        o = { x: 0, y: 1 };
        break;
    }
    return {
      timer: 0.2,
      area: [
        new BoundingBox(
          Math2d.add(player.state.position, s),
          Math2d.add({ x: player.hitBox.size.x, y: player.hitBox.size.y }, o),
          player.hitBox.offset
        ),
      ],
    };
  }
}
