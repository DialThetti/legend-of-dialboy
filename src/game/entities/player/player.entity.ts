import { PlayerRenderer } from './player.renderer';
import { PlayerState } from './player.state';

export class PlayerEntity {
  state!: PlayerState;
  renderer!: PlayerRenderer;

  async load() {
    this.renderer = new PlayerRenderer(this);
    await this.renderer.load();
    this.state = {
      direction: 'UP',
      position: { x: 5, y: 5 },
      step: 0,
    };
  }
}
