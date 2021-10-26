import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseLoggerDto } from './dto/base.dto';
import { Loggs, LoggsDocument } from './schemas/logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Loggs.name) private readonly model: Model<LoggsDocument>,
  ) {}

  async findAll(): Promise<Loggs[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Loggs> {
    return await this.model.findById(id).exec();
  }

  async create(BaseLoggerDto: BaseLoggerDto,pin: string): Promise<Loggs> {
    return await new this.model({
      ...BaseLoggerDto,pin
    }).save();
  }

  async update(id: string, updateTodoDto: BaseLoggerDto): Promise<Loggs> {
    return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async delete(id: string): Promise<Loggs> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}