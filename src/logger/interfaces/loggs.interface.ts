import { Document } from 'mongoose';

export interface Loggs extends Document {
  ip_endpoint: string
  token: string
  expire: Date
}