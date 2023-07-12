import { Point2d } from './point-2d';

export class Math2d {
  static norm(p: Point2d): Point2d {
    const n = Math.sqrt(p.x * p.x + p.y * p.y);

    return { x: p.x / n, y: p.y / n };
  }
}
