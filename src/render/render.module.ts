import { CoreModule } from '@core/core-module';
import { WorldRenderService } from './services/world-render.service';
import { PlayerRenderService } from './services/player-render.service';
import { SharedModule } from 'src/shared/shared.module';

export class RenderModule {
  fps = 60;
  ctx!: CanvasRenderingContext2D;

  constructor(private core: CoreModule, private shared: SharedModule) {}

  async load() {
    const canvas = document.getElementById('screen') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const playerRender = new PlayerRenderService(this.core.playerState);
    const worldRender = new WorldRenderService(this.core.playerState);
    await worldRender.load();
    await playerRender.load();
    this.shared.clock.repeat(() => {
      worldRender.drawWorld(this.ctx);
      playerRender.drawPlayer(this.ctx);
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
