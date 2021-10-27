import { Document } from 'mongoose';

export interface Loggs extends Document {
  ip_endpoint: string
  local_ip: string
  token: string
  expire: Date
}