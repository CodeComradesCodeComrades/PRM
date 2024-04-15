"use strict";
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const config = {
    type: 'postgres',
    name: 'default',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities: ['src/orm/entities/**/*.ts'],
    migrations: ['src/orm/migrations/**/*.ts'],
    subscribers: ['src/orm/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/orm/entities',
        migrationsDir: 'src/orm/migrations',
        subscribersDir: 'src/orm/subscriber',
    },
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
};
module.exports = config;
