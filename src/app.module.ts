import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { logger } from './common/middleware/logger.middleware';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/user'), UserModule, MenuModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(LoggerMiddleware)
      .apply(logger)
      // .forRoutes('users');
      // .forRoutes({ path: 'users', method: RequestMethod.ALL });
      .exclude(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
