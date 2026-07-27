import { getRuntimeNumber } from './runtime';

export const Timeouts = {
  AUTOCOMPLETE: getRuntimeNumber('AUTOCOMPLETE_TIMEOUT_MS', 20_000),
  BUZZ_FEED_API: getRuntimeNumber('BUZZ_FEED_API_TIMEOUT_MS', 10_000),
  DIRECTORY_LOAD_ATTEMPT: getRuntimeNumber('DIRECTORY_LOAD_ATTEMPT_TIMEOUT_MS', 10_000),
  DIRECTORY_PAGE: getRuntimeNumber('DIRECTORY_PAGE_TIMEOUT_MS', 60_000),
  DIRECTORY_TEST: getRuntimeNumber('DIRECTORY_TEST_TIMEOUT_MS', 120_000),
  TABLE: getRuntimeNumber('TABLE_TIMEOUT_MS', 20_000),
  USERS_API: getRuntimeNumber('USERS_API_TIMEOUT_MS', 10_000),
  TYPE_DELAY: getRuntimeNumber('TYPE_DELAY_MS', 80),
  DEFAULT: getRuntimeNumber('DEFAULT_TIMEOUT_MS', 10_000),
} as const;
