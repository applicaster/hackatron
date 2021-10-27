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
    const pincode = randomstring.generate(7);

    const verification_url = req.get('host')+"/verify"; 
    const data = {
      app_uuid: body.app_uuid,
      app_name: body.app_name,
      pincode: pincode
    };
    // return body
    return await this.service.create(data);
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