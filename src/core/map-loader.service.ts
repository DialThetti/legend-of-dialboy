import { Tileset } from 'src/models/tileset';
import { loadJson } from './load';

export class MapLoaderService {
  async loadMap(id: string): Promise<Tileset> {
    const map = await loadJson<Tileset>(`./map/${id}.json`);
    if (!map.entities) {
      map.entities = [];
    }
    if (map.map) {
      map.tiles = map.map.map(row => row.split('').map(c => this.mapToTile(c)));
    }
    return map;
  }
  mapToTile(char: string): number {
    return (
      {
        o: 1,
        ' ': 2,
        b: 10,
        J: 12,
        '^': 13,
        L: 14,
        '`': 18,
        x: 19,
        '/': 20,
      }[char] ?? 2
    );
  }
}
