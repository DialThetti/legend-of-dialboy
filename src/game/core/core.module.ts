import { SharedModule } from '../shared/shared.module';
import { KeyListener } from './key-listener';
import { PlayerController } from './player.controller';
import { Timer } from '@game/shared/clock';
import { PlayerEntity } from '@game/entities/player/player.entity';
import { MapEntity } from '@game/entities/map/map.entity';
import { GameState } from './game-state';
export class CoreModule {
  private static instance?: CoreModule;

  gameState = new GameState();
  private constructor(private sharedModule: SharedModule) {}

  async main(): Promise<void> {
    const kl = new KeyListener(this.sharedModule.loggerService);
    this.gameState.player = new PlayerEntity(this.gameState);
    await this.gameState.player.load();
    const playerController = new PlayerController(this.gameState, this.gameState.player, kl);
    this.gameState.mapEntity = new MapEntity(this.gameState);
    await this.gameState.mapEntity.load();
    await this.gameState.mapEntity.loadChunk();
    kl.start();
    let last = Date.now();
    Timer.repeat((dT: number) => {
      playerController.update(dT);
      if (!this.gameState.pause) {
        this.gameState.getEntities().forEach(e => e.update(dT));
      }
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
