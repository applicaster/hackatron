
import { Connection } from 'mongoose';
import { LoggsSchema } from './schemas/logger.schema';

export const loggerProviders = [
  {
    provide: 'LOGGER_MODEL',
    useFactory: (connection: Connection) => connection.model('Loggs', LoggsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];