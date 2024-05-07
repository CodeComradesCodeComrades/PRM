import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { unless } from 'express-unless';
import { existsSync } from 'fs';
import 'reflect-metadata';
import { ApiModule } from 'src/app.module';
import { envName, isDev, serverVersion } from 'src/constants';
import { swagger } from 'src/utils/api';
import { PRMLogger } from 'src/utils/logger';

async function importHandler() {
    return new Function(`return import('/usr/src/app/svelte/handler.js')`)();
}

async function bootstrap() {
    const logger = new PRMLogger('PRM-Server');
    const port = Number(process.env.SERVER_PORT) || 3001;

    const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
        bufferLogs: true,
    });

    if (isDev) {
        swagger(app);
    }

    app.useLogger(app.get(PRMLogger));
    app.use(json({ limit: '10mb' }));
    app.use(cookieParser());
    app.enableCors();

    app.setGlobalPrefix('api');
    if (isDev) {
        app.enableCors({ credentials: true });
    }

    if (!isDev && existsSync('/usr/src/app/svelte/handler.js')) {
        const handler = (await importHandler()).handler;
        handler.unless = unless;

        app.use(
            handler.unless({
                path: ['/api', /^\/api\/.*$/],
            }),
        );
    }

    const server = await app.listen(port);
    server.requestTimeout = 30 * 60 * 1000;

    logger.log(`PRM Server is listening on ${await app.getUrl()} [v${serverVersion}] [${envName}] `);
}

void bootstrap();
