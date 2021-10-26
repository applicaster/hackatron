import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loggs, LoggsSchema } from './schemas/logger.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loggs.name, schema: LoggsSchema }])],
  controllers: [LoggerController],
  providers: [LoggerService]
})

export class LoggerModule {}