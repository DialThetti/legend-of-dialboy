import { CoreModule } from '@core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { Timer } from 'src/shared/clock';
import { EntityState } from '../core/entities/entity.state';
import { HUDRenderer } from './hud.renderer';
import { SlimeEntity } from '../game/entities/slime/slime.entity';

export class RenderModule {
  fps = 60;
  ctx!: CanvasRenderingContext2D;

  constructor(private core: CoreModule, private shared: SharedModule) {}

  async load() {
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.scale(1, 1);
    const hud = new HUDRenderer();
    await hud.load(this.core.mapState);
    await this.core.mapState.load();
    Timer.repeat(async dT => {
      const entities = this.core.mapState.getEntities();
      const renderers = entities
        .filter(e => e.state)
        .sort((a, b) => a.state.position.z - b.state.position.z)
        .map(a => a.renderer);
      for (const re of renderers) {
        await re.render(this.ctx, dT);
      }

      if ((window as any).debug) {
        for (let x = 0; x < 16; x++) {
          for (let y = 0; y < 12; y++) {
            const solid = this.core.mapState.isSolidTile({ x, y });
            if (solid) {
              this.ctx.strokeStyle = 'red';
              this.ctx.strokeRect(x * 16, y * 16 + 3 * 16, 16, 16);
              this.ctx.beginPath();
              this.ctx.moveTo(x * 16, (y + 3) * 16);
              this.ctx.lineTo(x * 16 + 16, (y + 3) * 16 + 16);
              this.ctx.stroke();
              this.ctx.beginPath();
              this.ctx.moveTo(x * 16, (y + 3) * 16 + 16);
              this.ctx.lineTo(x * 16 + 16, (y + 3) * 16);
              this.ctx.stroke();
            }
          }
        }
      }
      //TODO top
      //  this.core.mapState.mapEntity.renderer.renderTop(this.ctx, dT);
      hud.render(this.ctx, dT);
    }).start();
  }
  private static instance?: RenderModule;

  static async get(): Promise<RenderModule> {
    if (!RenderModule.instance) {
      RenderModule.instance = new RenderModule(await CoreModule.get(), await SharedModule.get());
      await RenderModule.instance.load();
    }
    return RenderModule.instance;
  }
}
