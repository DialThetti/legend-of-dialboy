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
  async update(dT: number) {
    if (this.state.presentItem) {
      this.state.presentItem.timer -= dT;
      if (this.state.presentItem.timer <= 0) {
        delete this.state.presentItem;
      }
    }
  }
}
