import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res
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
// This api will return user_code device_code and verification_url in response to initial request
  @Post("/getcode")
  async create(@Req() req: any, @Body() body: any) {
    var randomstring = require("randomstring");
    const device_code = randomstring.generate(7);
    const user_code = randomstring.generate(12); 
    const verification_url = req.get('host')+"/verify"; 
    const expires_in = 600
    const interval = 60
    const data = {
      app_guid: body.app_guid,
      app_name: body.app_name,
      device_code,
      user_code,
      verification_url ,
      expires_in,
      interval
    };
    // return body
    return await this.service.create(data);
  }


  @Post("/verify")
    return "dummy reply"

  @Put(':id')
  async update(@Param('id') id: string, @Body() BaseLoggerDto: BaseLoggerDto) {
    return await this.service.update(id, BaseLoggerDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}