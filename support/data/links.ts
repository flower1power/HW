import { getRuntimeString } from './runtime';

const BASE_URL = getRuntimeString('ORANGEHRM_BASE_URL', 'https://opensource-demo.orangehrmlive.com');

export const Links = {
  BASE_URL,
  LOGIN_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_LOGIN_PATH', '/web/index.php/auth/login')}`,
  DASHBOARD_PATH: getRuntimeString('ORANGEHRM_DASHBOARD_PATH', '/web/index.php/dashboard/index'),
  ADMIN_USERS_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_ADMIN_USERS_PATH', '/web/index.php/admin/viewSystemUsers')}`,
  ADMIN_USERS_API_PATH: getRuntimeString('ORANGEHRM_ADMIN_USERS_API_PATH', '/web/index.php/api/v2/admin/users'),
} as const;
