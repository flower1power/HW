import { getRuntimeNumber } from './runtime';

export const DirectoryData = {
  DEFAULT_EMPLOYEES_API_LIMIT: 14,
  LARGE_EMPLOYEES_API_LIMIT: getRuntimeNumber('DIRECTORY_LARGE_EMPLOYEES_API_LIMIT', 1_000),
} as const;
