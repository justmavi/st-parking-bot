import { Scenes } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export interface Context extends Scenes.SceneContext {
  session: Scenes.SceneContext['session'] & {
    authorized: boolean;
    selectedGateId: number;
  };
  state: Scenes.SceneContext['state'] & {
    backPressed: boolean;
  };
  update: Update.CallbackQueryUpdate;
}
