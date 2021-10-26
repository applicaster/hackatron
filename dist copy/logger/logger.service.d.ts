import { Model } from 'mongoose';
import { BaseLoggerDto } from './dto/base.dto';
import { Loggs, LoggsDocument } from './schemas/logger.schema';
export declare class LoggerService {
    private readonly model;
    constructor(model: Model<LoggsDocument>);
    findAll(): Promise<Loggs[]>;
    findOne(id: string): Promise<Loggs>;
    create(BaseLoggerDto: BaseLoggerDto): Promise<Loggs>;
    update(id: string, updateTodoDto: BaseLoggerDto): Promise<Loggs>;
    delete(id: string): Promise<Loggs>;
}
