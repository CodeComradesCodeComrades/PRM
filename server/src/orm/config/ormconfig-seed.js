"use strict";
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const configSeed = {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities: ['src/orm/entities/**/*.ts'],
    migrations: ['src/orm/seeds/**/*.ts'],
    cli: {
        migrationsDir: 'src/orm/seeds',
    },
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
};
module.exports = configSeed;
