import { EntityState } from '@game/core/entities/entity.state';

export interface SlimeState extends EntityState {
  stepTimer: number;
  currentSleepTime: number;
  sleepTime: number;
  speed: number;
  color: 'GREEN' | 'RED' | 'BLUE' | 'VIOLET';
  dead: boolean;
}
