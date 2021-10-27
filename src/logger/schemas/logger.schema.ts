import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoggsDocument = Loggs & Document;

@Schema()
export class Loggs {
  @Prop()
  user_code: string;

  @Prop()
  device_code: string;
  
  @Prop()
  exp_date: string;

  @Prop()
  app_name: string;

  @Prop()
  app_guid: string;

  @Prop()
  verification_url: string;
  
  @Prop()   
  expires_in: number;
  
  @Prop()  
  interval: number;
}

export const LoggsSchema = SchemaFactory.createForClass(Loggs);