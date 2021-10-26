import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoggsDocument = Loggs & Document;

@Schema()
export class Loggs {
  @Prop()
  pin: string;

  @Prop()
  exp_date: string;

  @Prop()
  app_name: string;

  @Prop()
  app_guid: string;

  @Prop()
  data: string;
}

export const LoggsSchema = SchemaFactory.createForClass(Loggs);