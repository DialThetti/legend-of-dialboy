import { SharedModule } from '../game/shared/shared.module';
import { KeyListener } from './key-listener';
import { EntityCollider } from './entity-collider';
import { PlayerController } from './player.controller';
import { PlayerCollider } from './player-collider';
import { Timer } from '@game/shared/clock';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';
import { GameState } from './game-state';
export class CoreModule {
  private static instance?: CoreModule;

  mapState = new GameState();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    const entityCollider = new EntityCollider();
    const kl = new KeyListener(this.sharedModule.loggerService);
    this.mapState.player = new PlayerEntity();
    await this.mapState.player.load();
    const playerCollider = new PlayerCollider(this.mapState, this.mapState.player, entityCollider);
    const playerController = new PlayerController(this.mapState, this.mapState.player, kl, playerCollider);
    this.mapState.mapEntity = new MapEntity();
    await this.mapState.mapEntity.load();
    await this.mapState.loadChunk(this.mapState.mapEntity.state.currentMapId);
    kl.start();
    let last = Date.now();
    Timer.repeat((dT: number) => {
      this.mapState.getEntities().forEach(e => e.update(dT));
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
