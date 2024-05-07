import { serverConfig } from '$lib/stores/server-config.store';
import { getServerConfig } from '@prm/sdk';
import { get } from 'svelte/store';

export const loadServerConfig = async (options?: { noCache: boolean }) => {
  try {
    if (options!.noCache) {
      const loaded = await getServerConfig();
      serverConfig.set(loaded);
      return loaded;
    }
  } catch {
    return null;
  }

  try {
    let loaded = get(serverConfig);
    if (!loaded) {
      loaded = await getServerConfig();
      serverConfig.set(loaded);
    }
    return loaded;
  } catch {
    return null;
  }
};

export const GetOnboardedStatus = async (): Promise<boolean> => {
  const isOnboarded = (
    await loadServerConfig({
      noCache: true,
    })
  )?.isOnboarded;

  return isOnboarded ? true : false;
};
