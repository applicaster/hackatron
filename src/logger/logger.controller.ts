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
    // Parse data from the request
    const user_data = { 
      app_uuid: body.app_uuid,
      app_name: body.app_name,
      pin: body.pin,
    }
    // Validate pin here :
    // Make a call to the DB with app_name , pin and app_uuid 
    // If pin valid create a new token and assign this token to pin and app_name: 
    var randomstring = require("randomstring");
    const token = randomstring.generate(7);

    let expiration = new Date(); 
    expiration.setTime(expiration.getTime() + (8 * 60 * 60 * 1000));
    const verification_url = req.get('host')+"/verify"; 
    // send data back to user
    const data = {
      token: token,
      expire: expiration,
      ip_endpoint: verification_url
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