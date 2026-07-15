import { getRuntimeNumber } from './runtime';

export const Timeouts = {
  AUTOCOMPLETE: getRuntimeNumber('AUTOCOMPLETE_TIMEOUT_MS', 20_000),
  TABLE: getRuntimeNumber('TABLE_TIMEOUT_MS', 20_000),
  USERS_API: getRuntimeNumber('USERS_API_TIMEOUT_MS', 10_000),
  TYPE_DELAY: getRuntimeNumber('TYPE_DELAY_MS', 80),
  DEFAULT: getRuntimeNumber('DEFAULT_TIMEOUT_MS', 10_000),
} as const;
