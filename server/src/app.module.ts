import { Inject, Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRMAppConfig } from 'src/config';
import { controllers } from 'src/controllers';
import { databaseConfig } from 'src/database.config';
import { entities } from 'src/entities';
import { IDatabaseRepository } from 'src/interfaces/database.interface';
import { ErrorInterceptor } from 'src/middlewares/error.interceptor';
import { repositories } from 'src/repositories';
import { DatabaseRepository } from 'src/repositories/database.repository';
import { services } from 'src/services';
import { ApiService } from 'src/services/api.service';
import { PRMLogger } from 'src/utils/logger';

const providers = [PRMLogger];
const common = [...services, ...providers, ...repositories];

const imports = [
  ConfigModule.forRoot(PRMAppConfig),
  TypeOrmModule.forRoot(databaseConfig),
  TypeOrmModule.forFeature(entities),
];

const middleware = [
  // FileUploadInterceptor,
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ transform: true, whitelist: true }),
  },
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  // { provide: APP_GUARD, useClass: AuthGuard },
];

@Module({
  imports: [...imports, ScheduleModule.forRoot()],
  controllers: [...controllers],
  providers: [...common, ...middleware],
})
export class ApiModule implements OnModuleInit {
  constructor(private service: ApiService) {}

  async onModuleInit() {
    await this.service.init();
  }
}
