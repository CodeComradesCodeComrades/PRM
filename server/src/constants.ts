import { readFileSync } from 'fs';
import { Version } from 'src/utils/version';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));
export const serverVersion = Version.fromString(version);

export const envName = (process.env.NODE_ENV || 'development').toUpperCase();
export const isDev = process.env.NODE_ENV === 'development';

export const SALT_ROUNDS = 10;

export const PROJECT_NAME = 'PRM';

export const ACCESS_COOKIE = 'prm_access_token';
export const IS_AUTHENTICATED_COOKIE = 'prm_is_authenticated';
export const LOGIN_URL = '/login';
