import { GameState } from '../game-state';
import { Point2d } from '../math/point-2d';

export class AStar {
  constructor(private gameState: GameState) {}
  getPath(start: Point2d, target: Point2d): Point2d[] {
    const grid = this.buildGrid();
    this.setStep({ x: Math.round(target.x), y: Math.round(target.y) }, grid, 0);
    const path = this.gridToPath(grid, start);
    console.log(path);
    return path.map(p => ({ x: p.x - start.x, y: p.y - start.y }));
  }

  gridToPath(grid: StarTile[][], p: Point2d): Point2d[] {
    const result: Point2d[] = [];
    let t = p;
    let tries = 10;
    do {
      t = this.getMin(grid, t);
      result.push(t);
      tries--;
    } while (tries != 0 && grid[t.x][t.y].steps != 0);
    return result;
  }

  getMin(grid: StarTile[][], p: Point2d): Point2d {
    let v = 99;
    let t = p;
    const checks = [
      () => {
        const n = grid[p.x - 1]?.[p.y]?.steps ?? 99;
        if (n <= v) {
          v = n;
          t = { x: p.x - 1, y: p.y };
        }
      },
      () => {
        const n = grid[p.x + 1]?.[p.y]?.steps ?? 99;
        if (n <= v) {
          v = n;
          t = { x: p.x + 1, y: p.y };
        }
      },
      () => {
        const n = grid[p.x]?.[p.y - 1]?.steps ?? 99;
        if (n <= v) {
          v = n;
          t = { x: p.x, y: p.y - 1 };
        }
      },
      () => {
        const n = grid[p.x]?.[p.y + 1]?.steps ?? 99;
        if (n <= v) {
          v = n;
          t = { x: p.x, y: p.y + 1 };
        }
      },
    ];
    this.shuffle(checks);
    checks.forEach(c => c());
    return t;
  }
  shuffle<T>(array: T[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  setStep(p: Point2d, grid: StarTile[][], steps: number) {
    if (p.x < 0 || p.y < 0 || p.x > 15 || p.y > 11) {
      return;
    }
    if (grid[p.x][p.y].solid) {
      return;
    }
    if ((grid[p.x][p.y].steps ?? 99) < steps) {
      return;
    }
    grid[p.x][p.y].steps = steps;
    this.setStep({ x: p.x - 1, y: p.y }, grid, steps + 1);
    this.setStep({ x: p.x + 1, y: p.y }, grid, steps + 1);
    this.setStep({ x: p.x, y: p.y - 1 }, grid, steps + 1);
    this.setStep({ x: p.x, y: p.y + 1 }, grid, steps + 1);
  }

  buildGrid(): StarTile[][] {
    const r: StarTile[][] = [];
    for (let x = 0; x < 16; x++) {
      r.push([]);
      for (let y = 0; y < 12; y++) {
        r[x][y] = {
          solid: this.gameState.isSolidTile({ x, y }),
        } as StarTile;
      }
    }
    return r;
  }
}

interface StarTile {
  solid: boolean;
  steps?: number;
}
