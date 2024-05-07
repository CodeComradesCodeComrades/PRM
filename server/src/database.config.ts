import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const url = process.env.DB_URL;
const urlOrParts = url
    ? { url }
    : {
          host: process.env.DB_HOSTNAME || 'localhost',
          port: Number.parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE_NAME || 'prm',
      };

export const databaseConfig: PostgresConnectionOptions = {
    type: 'postgres',
    entities: [__dirname + '/entities/*.entity.{js,ts}'],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    subscribers: [__dirname + '/subscribers/*.{js,ts}'],
    migrationsRun: false,
    synchronize: false,
    connectTimeoutMS: 10_000, // 10 seconds
    parseInt8: true,
    ...urlOrParts,
};

// this export is used by TypeORM commands in package.json#scripts
export const dataSource = new DataSource(databaseConfig);
