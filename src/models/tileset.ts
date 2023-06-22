import { Entity } from './entity';

export interface Tileset {
  tiles: number[][];
  map: string[];
  color: number;
  properties: {
    solid: number[];
  };
  entities: Entity[];
}
