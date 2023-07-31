import { loadJson } from '../load';
import BoundingBox from '../math/rectangle';
import { Renderable } from './renderable';
import { Tileset } from './tileset';
import {
  InfiniteTmxLayer,
  InfiniteTmxModel,
  TmxChunk,
  TmxLayer,
  TmxObject,
  TmxObjectLayer,
  isInfiniteLayer,
} from './tileset.map.model';

export class TilesBasedMap {
  private constructor(private definitionFile: InfiniteTmxModel, public tilesets: Tileset[]) {}
  mapIdToPosition(hex: string): { x: number; y: number } {
    const id = parseInt(hex, 16);
    let y = Math.floor(id / 16);
    let x = id - y * 16;
    return { x: x * 16, y: y * 12 };
  }
  getChunk(hex: string, top: boolean = false): Chunk {
    const position = this.mapIdToPosition(hex);

    const chunk = this.definitionFile.layers

      .filter(layer => (top ? layer.name === 'top' : layer.name !== 'top'))
      .map(layer => {
        if (isInfiniteLayer(layer as any)) {
          return (layer as InfiniteTmxLayer).chunks.filter(c => c.x === position.x && c.y === position.y);
        } else {
          return null;
        }
      })
      .filter(c => !!c)
      .map(l => (l as TmxChunk[]).map(c => c.data))
      .map(c => c.flatMap((a, b) => [...a, b], []));
    const events = ((this.definitionFile.layers.find(e => e.type === 'objectgroup') as TmxObjectLayer)?.objects ?? [])
      .map(o => {
        return { ...o, x: o.x / 16 - position.x, y: o.y / 16 - position.y, width: o.width / 16, height: o.height / 16 };
      })
      .filter(o => {
        return new BoundingBox({ x: o.x, y: o.y }, { x: o.width, y: o.height }).overlaps(
          new BoundingBox({ x: 0, y: 0 }, { x: 16, y: 12 })
        );
      });
    return new Chunk(chunk, this, events);
  }

  public static async load(src: string): Promise<TilesBasedMap> {
    const dir = src.substring(0, src.lastIndexOf('/'));
    const definitionFile = await loadJson<InfiniteTmxModel>(src);
    const tilesets = await Promise.all(
      definitionFile.tilesets.map(async tileset => await Tileset.load(dir + '/' + tileset.source, tileset.firstgid))
    );
    const getZ = (l: any) => l.properties.find((p: { name: string }) => p.name === 'zindex')?.value as number;
    return new TilesBasedMap(
      {
        ...definitionFile,
        layers: [
          ...definitionFile.layers
            .filter(l => l.visible)
            .filter(l => l.type === 'tilelayer')
            .sort((l1, l2) => getZ(l1) - getZ(l2)),

          ...definitionFile.layers.filter(t => t.type === 'objectgroup'),
        ],
      },
      tilesets
    );
  }
}

export class Chunk implements Renderable {
  constructor(private data: number[][], private parent: TilesBasedMap, public obj: TmxObject[]) {}

  draw(ctx: CanvasRenderingContext2D, position: { x: number; y: number }) {
    for (let layer = 0; layer < this.data.length; layer++) {
      const grid = this.data[layer];
      for (let i = 0; i < grid.length; i++) {
        const y = Math.floor(i / 16);
        const x = i - y * 16;
        const tile = this.parent.tilesets.map(t => t.getTile(grid[i])).find(a => a);
        tile?.draw(ctx, { x: x * 16 + position.x, y: y * 16 + position.y });
      }
    }
  }

  getTilesAt(position: { x: number; y: number }): { [key: string]: any } {
    let meta = {};
    for (let layer = 0; layer < this.data.length; layer++) {
      const grid = this.data[layer];
      if (position.x > 15 || position.y > 11 || position.x < 0 || position.y < 0) {
        return {};
      }
      const tile = this.parent.tilesets
        .map(t => t.getTile(grid[position.x + 16 * position.y]))
        .find(a => a)
        ?.getMetadata();
      meta = { ...meta, ...tile };
    }
    return meta;
  }
  isSolid(position: { x: number; y: number }): boolean {
    const meta = this.getTilesAt({ x: Math.floor(position.x), y: Math.floor(position.y) });

    return meta.solid === true;
  }
}
