import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'), LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
