import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { MapState } from './map-state';
import { MapLoaderService } from './map-loader.service';
import { EntityCollider } from './entity-collider';
import { PlayerController } from './player.controller';
import { PlayerCollider } from './player-collider';
import { Timer } from 'src/shared/clock';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';
export class CoreModule {
  private static instance?: CoreModule;

  mapState = new MapState();
  mapLoader = new MapLoaderService();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    let map7_7 = await this.mapLoader.loadMap('m7_7');

    this.mapState.map = map7_7;
    const entityCollider = new EntityCollider();
    const kl = new KeyListener(this.sharedModule.loggerService);
    this.mapState.player = new PlayerEntity();
    await this.mapState.player.load();
    const playerCollider = new PlayerCollider(this.mapState, this.mapState.player, entityCollider);
    const playerController = new PlayerController(
      this.mapState,
      this.mapState.player,
      kl,
      this.mapLoader,
      playerCollider
    );
    this.mapState.mapEntity = new MapEntity();
    await this.mapState.mapEntity.load(this.mapState.map);
    kl.start();
    let last = Date.now();
    Timer.repeat((dT: number) => {
      playerController.update(dT);
    }).start();
  }

  static async get(): Promise<CoreModule> {
    if (!CoreModule.instance) {
      CoreModule.instance = new CoreModule(await SharedModule.get());
      await CoreModule.instance.main();
    }
    return CoreModule.instance;
  }
}
