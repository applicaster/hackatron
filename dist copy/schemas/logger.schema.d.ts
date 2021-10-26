import { Document } from 'mongoose';
export declare type LoggsDocument = Loggs & Document;
export declare class Loggs {
    pin: string;
    exp: string;
    app_name: string;
    app_guid: string;
}
export declare const LoggsSchema: import("mongoose").Schema<Document<Loggs, any, any>, import("mongoose").Model<Document<Loggs, any, any>, any, any, any>, {}>;
