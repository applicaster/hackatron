import * as mongoose from 'mongoose';

export const LoggsSchema = new mongoose.Schema({
  ip_endpoint: String,
  token: String,
  local_ip: String,
  expire: Date
});