import { loadImage, loadJson } from '../load';
import { Renderable } from './renderable';
import { TilesTilesetDefinition } from './tileset.tiles.model';

export class Tileset {
  private constructor(
    public image: HTMLImageElement,
    public definition: TilesTilesetDefinition,
    private firstId: number
  ) {}

  getTile(id: number): Tile | null {
    const idOnTileSet = id - this.firstId;
    if (idOnTileSet < 0 || idOnTileSet >= this.definition.tilecount) {
      return null;
    }

    return new Tile(this, idOnTileSet);
  }
  /**
   *
   * @param src Expects a tileset json
   * @returns
   */
  public static async load(src: string, firstId: number): Promise<Tileset> {
    const definitionFile = await loadJson<TilesTilesetDefinition>(src);
    const image = await loadImage('./tiles/' + definitionFile.image);
    return new Tileset(image, definitionFile, firstId);
  }
}

export class Tile implements Renderable {
  x: number;
  y: number;
  constructor(private parent: Tileset, private id: number) {
    this.y = Math.floor(id / parent.definition.columns);
    this.x = id - this.y * parent.definition.columns;
  }
  draw(ctx: CanvasRenderingContext2D, position: { x: number; y: number }) {
    ctx.drawImage(this.parent.image, this.x * 16, this.y * 16, 16, 16, position.x, position.y, 16, 16);
  }
  getMetadata(): { [key: string]: any } {
    const properties = this.parent.definition.tiles?.find((p: any) => p.id === this.id)?.properties ?? [];
    if (properties.length != 0) {
      return properties.reduce(
        (a: { [key: string]: any }, b: { name: string; value: any }) => ({ ...a, [b.name]: b.value }),
        {}
      );
    }
    return {};
  }
}
