import { EntityState } from '@game/core/entities/entity.state';

export interface MapState extends EntityState {
  currentMapId: string;
}
