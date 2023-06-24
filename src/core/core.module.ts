import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { PlayerStateService } from './player-state.service';
import { MapLoaderService } from './map-loader.service';
import { EntityCollider } from './entity-collider';
import { PlayerController } from './player.controller';
import { PlayerCollider } from './player-collider';
export class CoreModule {
  private static instance?: CoreModule;

  playerState = new PlayerStateService();
  mapLoader = new MapLoaderService();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    let map7_7 = await this.mapLoader.loadMap('m7_7');

    this.playerState.map = map7_7;
    const entityCollider = new EntityCollider();
    const kl = new KeyListener(this.sharedModule.loggerService);
    const playerCollider = new PlayerCollider(this.playerState, entityCollider);
    const playerController = new PlayerController(this.playerState, kl, this.mapLoader, playerCollider);
    kl.start();
    let last = Date.now();
    this.sharedModule.clock.repeat((dT: number) => {
      playerController.update(dT);
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
