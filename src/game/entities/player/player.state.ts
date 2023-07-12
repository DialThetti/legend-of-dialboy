import { EntityState } from '@game/core/entities/entity.state';

export interface PlayerState extends EntityState {
  step: number;
  hearts: { current: number; max: number };
  presentItem?: {
    item: string;
    timer: number;
  };
  ghost: boolean;
  speed: number;
  forcedWay: number;
  entityGhost: number;
}
