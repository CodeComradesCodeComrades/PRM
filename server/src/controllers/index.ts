import { AuthController } from 'src/controllers/auth.controller';
import { DiaryController } from 'src/controllers/diary.controller';
import { ServerInfoController } from 'src/controllers/server-info.controller';
import { UserController } from 'src/controllers/user.controller';

export const controllers = [UserController, AuthController, DiaryController, ServerInfoController];
