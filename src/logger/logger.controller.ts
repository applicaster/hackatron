import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseLoggerDto } from './dto/base.dto';
import {  } from './dto/base.dto';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly service: LoggerService) {}

  @Get()
  async index() {
    return await this.service.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post("/getpin")
  async create(@Body() body: any) {
    var randomstring = require("randomstring");
    const pin = randomstring.generate(7);
    // return body
    return await this.service.create(body,pin);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() BaseLoggerDto: BaseLoggerDto) {
    return await this.service.update(id, BaseLoggerDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}