import { CoreModule } from '@core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { EntityRenderer } from './entity.renderer';
import { PlayerRenderer } from '@game/entities/player/player.renderer';
import { Timer } from 'src/shared/clock';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';

export class RenderModule {
  fps = 60;
  ctx!: CanvasRenderingContext2D;

  constructor(private core: CoreModule, private shared: SharedModule) {}

  async load() {
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.scale(1, 1);
    const entityRenderer = new EntityRenderer(this.core.mapState);

    Timer.repeat(dT => {
      this.core.mapState.mapEntity.renderer.render(this.ctx);
      entityRenderer.render(this.ctx);
      this.core.mapState.player.renderer.render(this.ctx, dT);
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
