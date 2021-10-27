import { Document } from 'mongoose';

export interface Loggs extends Document {
  pincode: string;
  app_name: string;
  app_uuid: string;
}