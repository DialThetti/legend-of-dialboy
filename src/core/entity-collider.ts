export type Rect = { position: { x: number; y: number }; size: { width: number; height: number } };
export class EntityCollider {
  collide(e1: Rect, e2: Rect): boolean {
    return this.entityIn(e1, e2) || this.entityIn(e2, e1);
  }

  entityIn(e1: Rect, e2: Rect): boolean {
    return (
      this.in({ x: e1.position.x, y: e1.position.y }, e2) ||
      this.in({ x: e1.position.x + e1.size.width, y: e1.position.y }, e2) ||
      this.in({ x: e1.position.x, y: e1.position.y + e1.size.height }, e2) ||
      this.in({ x: e1.position.x + e1.size.width, y: e1.position.y + e1.size.height }, e2)
    );
  }

  in(p: { x: number; y: number }, rect: Rect): boolean {
    return (
      rect.position.x <= p.x &&
      p.x <= rect.position.x + rect.size.width &&
      rect.position.y <= p.y &&
      p.y <= rect.position.y + rect.size.height
    );
  }
}
