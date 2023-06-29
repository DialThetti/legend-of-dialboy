import { EntityState } from '../../../core/entities/entity.state';

export interface PlayerState extends EntityState {
  step: number;
  direction: string;
  presentItem?: {
    item: string;
    timer: number;
  };
}
