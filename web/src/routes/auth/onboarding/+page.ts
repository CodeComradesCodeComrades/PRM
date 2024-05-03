import { AppRoute } from '$lib/constants';
import { loadUser } from '$lib/utils/auth';
import { GetOnboardedStatus, loadServerConfig } from '$lib/utils/config';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
  const isOnboarded = await GetOnboardedStatus();

  const authenticated = await loadUser();

  if (isOnboarded) {
    if (authenticated) {
      redirect(302, AppRoute.MAIN_PAGE);
    } else {
      redirect(302, AppRoute.AUTH_LOGIN);
    }
  }

  return {
    meta: {
      title: 'PRM',
    },
  };
}) satisfies PageLoad;
