import { EntityState } from '@game/core/entities/entity.state';
import BoundingBox from '../../core/math/rectangle';

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
  attack?: Attack;
}

interface Attack {
  timer: number;
  area: BoundingBox[];
  properties?: string[];
  next?: Attack;
}
