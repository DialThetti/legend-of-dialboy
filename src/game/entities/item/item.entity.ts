import { ItemRenderer } from './item.renderer';
import { ItemState } from './item.state';

export class ItemEntity {
  state!: ItemState;
  renderer!: ItemRenderer;

  async load(state: ItemState) {
    this.renderer = new ItemRenderer(this);
    await this.renderer.load();
    this.state = state;
  }
}
