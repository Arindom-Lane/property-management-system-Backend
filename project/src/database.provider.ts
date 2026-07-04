
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'admin',
        database: 'property_Management_system',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,

      });

      return dataSource.initialize();
    },
  },
];
