import { defaults } from '@prm/sdk';

export const load = ({ fetch }) => {
  defaults.fetch = fetch;
};
