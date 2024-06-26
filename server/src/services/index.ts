import { ApiService } from 'src/services/api.service';
import { AuthService } from 'src/services/auth.service';
import { DatabaseService } from 'src/services/database.service';
import { DiaryService } from 'src/services/diary.service';
import { ServerInfoService } from 'src/services/server-info.service';
import { UserService } from 'src/services/user.service';

export const services = [ApiService, DatabaseService, UserService, AuthService, DiaryService, ServerInfoService];
