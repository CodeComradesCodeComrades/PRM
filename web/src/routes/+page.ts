import { GetOnboardedStatus, loadServerConfig } from '$lib/utils/config';
import { getMyUser, getServerConfig } from '@prm/sdk';
import { redirect } from '@sveltejs/kit';
import { AppRoute } from '../lib/constants';
import { loadUser } from '../lib/utils/auth';
import type { PageLoad } from './$types';

export const ssr = false;
export const csr = true;

export const load = (async () => {
  const isOnboarded = await GetOnboardedStatus();

  if (!isOnboarded) {
    redirect(302, AppRoute.AUTH_ONBOARDING);
  }
  const authenticated = await loadUser();
  if (!authenticated) {
    redirect(302, AppRoute.AUTH_LOGIN);
  }

  return {
    meta: {
      title: 'PRM',
    },
  };
}) satisfies PageLoad;
