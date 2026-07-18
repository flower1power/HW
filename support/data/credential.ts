import { getRuntimeString } from './runtime';

export const Credential = {
  ADMIN_USERNAME: getRuntimeString('ADMIN_USERNAME', 'Admin'),
  ADMIN_PASSWORD: getRuntimeString('ADMIN_PASSWORD', 'admin123'),
} as const;
