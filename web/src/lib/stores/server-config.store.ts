import type { ServerConfigDto, UserResponseDto } from '@prm/sdk';
import { writable } from 'svelte/store';

export const serverConfig = writable<ServerConfigDto>();

/**
 * Reset the store to its initial undefined value. Make sure to
 * only do this _after_ redirecting to an unauthenticated page.
 */
export const resetSavedConfig = () => {
  serverConfig.set(undefined as unknown as ServerConfigDto);
};
