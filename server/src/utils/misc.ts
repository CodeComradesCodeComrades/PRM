import { PRMLogger } from 'src/utils/logger';

export const isConnectionAborted = (error: Error | any) => error.code === 'ECONNABORTED';

export const handlePromiseError = <T>(promise: Promise<T>, logger: PRMLogger): void => {
    promise.catch((error: Error | any) => logger.error(`Promise error: ${error}`, error?.stack));
};

export interface OpenGraphTags {
    title: string;
    description: string;
    imageUrl?: string;
}

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

// export const routeToErrorMessage = (methodName: string) =>
//     'Failed to ' + methodName.replaceAll(/[A-Z]+/g, (letter) => ` ${letter.toLowerCase()}`);

export const routeToErrorMessage = (methodName: string) =>
    'Failed to ' + methodName.replace(/([A-Z])/g, ' $1').toLowerCase();
