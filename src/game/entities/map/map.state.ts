import { EntityState } from '../../../core/entities/entity.state';

export interface MapState extends EntityState {
  currentMapId: string;
}
