import * as mongoose from 'mongoose';

export const LoggsSchema = new mongoose.Schema({
  ip_endpoint: String,
  token: String,
  expire: Date
});