import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { PlayerController } from './player.controller';
import { Timer } from '@game/shared/clock';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';
import { GameState } from './game-state';
export class CoreModule {
  private static instance?: CoreModule;

  mapState = new GameState();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    const kl = new KeyListener(this.sharedModule.loggerService);
    this.mapState.player = new PlayerEntity(this.mapState);
    await this.mapState.player.load();
    const playerController = new PlayerController(this.mapState, this.mapState.player, kl);
    this.mapState.mapEntity = new MapEntity(this.mapState);
    await this.mapState.mapEntity.load();
    await this.mapState.mapEntity.loadChunk();
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
