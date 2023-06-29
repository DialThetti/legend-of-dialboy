import { CoreModule } from '@core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { EntityRenderer } from './entity.renderer';
import { Timer } from 'src/shared/clock';
import { EntityState } from '../core/entities/entity.state';

export class RenderModule {
  fps = 60;
  ctx!: CanvasRenderingContext2D;

  constructor(private core: CoreModule, private shared: SharedModule) {}

  async load() {
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.scale(1, 1);
    const entityRenderer = new EntityRenderer(this.core.mapState);

    Timer.repeat(async dT => {
      const entities = this.core.mapState.getEntities();
      entities.push({ state: { position: { z: 50 } } as EntityState, renderer: entityRenderer });
      const renderers = entities.sort((a, b) => a.state.position.z - b.state.position.z).map(a => a.renderer);
      for (const re of renderers) {
        await re.render(this.ctx, dT);
      }
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
