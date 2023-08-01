import BoundingBox from '../math/rectangle';
import { EntityRenderer } from './entity.renderer';
import { EntityState } from './entity.state';

export interface Entity {
  state: EntityState;
  renderer: EntityRenderer;
  update(dt: number): void;
  get hitBox(): BoundingBox;
}
