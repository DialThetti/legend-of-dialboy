import { EntityState } from '../../../core/entities/entity.state';

export interface SlimeState extends EntityState {
  stepTimer: number;
  velocity: { x: number; y: number };
  sleepTime: number;
  speed: number;
  color: 'GREEN' | 'RED' | 'BLUE' | 'VIOLET';
}
