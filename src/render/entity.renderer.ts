import { loadImage } from '@core/load';
import { MapState } from '@core/map-state';

export class EntityRenderer {
  constructor(private playerState: MapState) {}
  async load() {}

  async render(ctx: CanvasRenderingContext2D) {
    const textEntities = this.playerState.map.entities.filter(e => e.traits.find(t => t.name === 'text'));
    textEntities.forEach(e => {
      const txt = e.traits.find(t => t.name === 'text')?.payload;
      if (!txt.timer) {
        txt.timer = 0;
      }
      txt.timer += 1 / 5;

      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(
        txt.text.substring(0, Math.floor(txt.timer - (txt.offset ?? 0))),
        e.position.x * 16,
        (4 + e.position.y) * 16
      );
    });
    const renderableEntities = this.playerState.map.entities.filter(e => e.traits.find(t => t.name === 'renderable'));

    await Promise.all(
      renderableEntities.map(async e => {
        const r = e.traits.find(t => t.name === 'renderable');
        const p = e.traits.find(t => t.name === 'pickup');
        if (p) {
          if (!p.payload.respawn && (this.playerState.inventory as any)[p.payload.id]) {
            return;
          }
        }
        const i = await loadImage('./gfx/' + r?.payload.spritesheet);
        const spritePos = r?.payload.position;
        ctx.drawImage(
          i,
          spritePos.x,
          spritePos.y,
          e.size?.width ?? 0,
          e.size?.height ?? 0,
          e.position.x * 16,
          e.position.y * 16 + 4 * 16,
          e.size?.width ?? 0,
          e.size?.height ?? 0
        );
      })
    );

    if ((window as any).debug) {
      ctx.strokeStyle = 'blue';
      this.playerState.map.entities.forEach(entity => {
        ctx.strokeRect(entity.position.x * 16, 4 * 16 + entity.position.y * 16, entity.size.width, entity.size.height);
      });
    }
  }
}
