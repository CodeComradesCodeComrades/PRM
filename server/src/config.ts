import { ConfigModuleOptions } from '@nestjs/config';

// const WHEN_DB_URL_SET = Joi.when('DB_URL', {
//     is: Joi.exist(),
//     then: Joi.string().optional(),
//     otherwise: Joi.string().required(),
// });

export const PRMAppConfig: ConfigModuleOptions = {
    envFilePath: '.env',
    isGlobal: true,
    // validationSchema: Joi.object({
    //     NODE_ENV: Joi.string().optional().valid('development', 'production', 'staging').default('development'),
    //     LOG_LEVEL: Joi.string()
    //         .optional()
    //         .valid(...Object.values(LogLevel)),

    //     DB_USERNAME: Joi.string(),
    //     DB_PASSWORD: Joi.string(),
    //     DB_DATABASE_NAME: Joi.string(),
    //     DB_URL: Joi.string().optional(),
    // }),
};
