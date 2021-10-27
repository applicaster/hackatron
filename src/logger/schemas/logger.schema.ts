import * as mongoose from 'mongoose';

export const LoggsSchema = new mongoose.Schema({

  app_name: String,
  app_uuid: String,
  pincode: String,

});