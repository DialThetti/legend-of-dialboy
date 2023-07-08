import { RenderModule } from './render/render.module';

export class GameModule {
  private static instance?: GameModule;

  constructor(private render: RenderModule) {
    document.title = 'The Legend of Dialboy';
  }

  static async get(): Promise<GameModule> {
    if (!GameModule.instance) {
      GameModule.instance = new GameModule(await RenderModule.get());
    }
    return GameModule.instance;
  }
}
