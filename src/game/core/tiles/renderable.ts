export interface Renderable {
  draw(ctx: CanvasRenderingContext2D, position: { x: number; y: number }): void;
}
