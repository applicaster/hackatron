import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://applicaster:yAZmIDR62adN39Pj@cluster0.xwumj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
  },
];