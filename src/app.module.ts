import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { logger } from './common/middleware/logger.middleware';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './menu/menu.module';
import { WinstonModule } from './winston/winston.module';
import { transports, format } from 'winston';
import * as chalk from 'chalk';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/user'), UserModule, MenuModule,
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);

              return `${appStr} ${time} ${level} ${contextStr} ${message} `;
            })
          ),

        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
          // level: 'error',
        }),
      ]
    })
  ],
  // imports: [MongooseModule.forRoot('mongodb://mongodb/user'), UserModule, MenuModule], // docker

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
