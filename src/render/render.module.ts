import { CoreModule } from '@core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { EntityRenderer } from './entity.renderer';
import { PlayerRenderer } from './player.renderer';
import { WorldRenderer } from './world.renderer';

export class RenderModule {
  fps = 60;
  ctx!: CanvasRenderingContext2D;

  constructor(private core: CoreModule, private shared: SharedModule) {}

  async load() {
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.scale(1, 1);
    const playerRender = new PlayerRenderer(this.core.playerState);
    const entityRenderer = new EntityRenderer(this.core.playerState);
    const worldRender = new WorldRenderer(this.core.playerState);
    await worldRender.load();
    await playerRender.load();
    this.shared.clock.repeat(dT => {
      worldRender.drawWorld(this.ctx);
      entityRenderer.render(this.ctx);
      playerRender.render(this.ctx, dT);
    });
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
