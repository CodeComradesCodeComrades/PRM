import { readFileSync } from 'fs';
import { Version } from 'src/utils/version';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));
export const serverVersion = Version.fromString(version);

export const envName = (process.env.NODE_ENV || 'development').toUpperCase();
export const isDev = process.env.NODE_ENV === 'development';

export const SALT_ROUNDS = 10;
