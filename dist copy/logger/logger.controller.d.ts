import { BaseLoggerDto } from './dto/base.dto';
import { LoggerService } from './logger.service';
export declare class LoggerController {
    private readonly service;
    constructor(service: LoggerService);
    index(): Promise<import("./schemas/logger.schema").Loggs[]>;
    find(id: string): Promise<import("./schemas/logger.schema").Loggs>;
    create(body: any): Promise<import("./schemas/logger.schema").Loggs>;
    update(id: string, BaseLoggerDto: BaseLoggerDto): Promise<import("./schemas/logger.schema").Loggs>;
    delete(id: string): Promise<import("./schemas/logger.schema").Loggs>;
}
