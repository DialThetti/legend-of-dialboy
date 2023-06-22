import { Tileset } from 'src/models/tileset';
import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { loadJson } from './load';
import { PlayerStateService } from './player-state.service';
import { WorldClock } from './world-clock.service';
import { MapLoaderService } from './map-loader.service';
export class CoreModule {
  private static instance?: CoreModule;

  playerState = new PlayerStateService();
  mapLoader = new MapLoaderService();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    let map7_7 = await this.mapLoader.loadMap('m7_7');

    this.playerState.map = map7_7;
    const kl = new KeyListener(this.playerState, this.sharedModule.loggerService);
    const worldClock = new WorldClock(this.playerState, kl, this.mapLoader);
    kl.start();

    this.sharedModule.clock.repeat(() => {
      worldClock.update();
    });
  }

  static async get(): Promise<CoreModule> {
    if (!CoreModule.instance) {
      CoreModule.instance = new CoreModule(await SharedModule.get());
      await CoreModule.instance.main();
    }
    return CoreModule.instance;
  }
}
