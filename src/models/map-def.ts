import { Entity } from './entity';

export interface MapDefinition {
  tiles: number[][];
  map: string[];
  color: number;
  properties: {
    solid: number[];
  };
  entities: Entity[];
}
