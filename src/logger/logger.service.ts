import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Loggs } from './interfaces/loggs.interface';
import { BaseLoggerDto } from './dto/base.dto';

@Injectable()
export class LoggerService {
  constructor(
    @Inject('LOGGER_MODEL')
    private model: Model<Loggs>,
  ) {}

  async findAll(): Promise<Loggs[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Loggs> {
    return await this.model.findById(id).exec();
  }

  async create(BaseLoggerDto: BaseLoggerDto): Promise<Loggs> {
    return await new this.model({
      ...BaseLoggerDto
    }).save();
  }

  async update(id: string, BaseLoggerDto: BaseLoggerDto): Promise<Loggs> {
    return await this.model.findByIdAndUpdate(id, BaseLoggerDto).exec();
  }

  async delete(id: string): Promise<Loggs> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}