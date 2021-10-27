import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { loggerProviders } from './logger.providers';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LoggerController],
  providers: [
    LoggerService,
    ...loggerProviders,
  ],
})
export class LoggerModule {}
