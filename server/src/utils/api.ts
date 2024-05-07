import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import _ from 'lodash';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PROJECT_NAME, isDev, serverVersion } from 'src/constants';
import { Metadata } from 'src/middlewares/auth.guard';

function sortKeys<T>(target: T): T {
    if (!target || typeof target !== 'object' || Array.isArray(target)) {
        return target;
    }

    const result: Partial<T> = {};
    const keys = Object.keys(target).sort() as Array<keyof T>;
    for (const key of keys) {
        result[key] = sortKeys(target[key]);
    }
    return result as T;
}

const patchOpenAPI = (document: OpenAPIObject) => {
    document.paths = sortKeys(document.paths);

    if (document.components?.schemas) {
        const schemas = document.components.schemas as Record<string, SchemaObject>;

        document.components.schemas = sortKeys(schemas);

        for (const schema of Object.values(schemas)) {
            if (schema.properties) {
                schema.properties = sortKeys(schema.properties);
            }

            if (schema.required) {
                schema.required = schema.required.sort();
            }
        }
    }

    for (const [key, value] of Object.entries(document.paths)) {
        const newKey = key.replace('/api/', '/');
        delete document.paths[key];
        document.paths[newKey] = value;
    }

    for (const path of Object.values(document.paths)) {
        const operations = {
            get: path.get,
            put: path.put,
            post: path.post,
            delete: path.delete,
            options: path.options,
            head: path.head,
            patch: path.patch,
            trace: path.trace,
        };

        for (const operation of Object.values(operations)) {
            if (!operation) {
                continue;
            }

            if ((operation.security || []).some((item) => !!item[Metadata.PUBLIC_SECURITY])) {
                delete operation.security;
            }

            if (operation.summary === '') {
                delete operation.summary;
            }

            if (operation.description === '') {
                delete operation.description;
            }

            if (operation.parameters) {
                operation.parameters = _.orderBy(operation.parameters, 'name');
            }
        }
    }

    return document;
};

export const swagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle(PROJECT_NAME)
        .setDescription(`${PROJECT_NAME}'s Api`)
        .setVersion(serverVersion.toString())
        .addServer('/api')
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('docs', app, document);

    if (isDev) {
        const outputPath = path.resolve(process.cwd(), '../open-api/openapi-specs.json');
        writeFileSync(outputPath, JSON.stringify(patchOpenAPI(document), null, 2), { encoding: 'utf8' });
    }
};
