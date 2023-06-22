import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { loadJson } from './load';
import { PlayerStateService } from './player-state.service';
import { WorldClock } from './world-clock.service';
import { Tileset } from './tileset';

export class CoreModule {
  private static instance?: CoreModule;

  playerState = new PlayerStateService();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    let map7_7 = await loadJson<Tileset>('./map/m7_7.json');

    this.playerState.map = map7_7;
    const kl = new KeyListener(this.playerState, this.sharedModule.loggerService);
    const worldClock = new WorldClock(this.playerState, kl);
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
