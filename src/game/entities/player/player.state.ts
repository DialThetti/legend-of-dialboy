import { EntityState } from '../../../core/entities/entity.state';

export interface PlayerState extends EntityState {
  step: number;
  hearts: { current: number; max: number };
  presentItem?: {
    item: string;
    timer: number;
  };
  ghost: boolean;
}
