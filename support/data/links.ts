import { getRuntimeString } from './runtime';

const BASE_URL = getRuntimeString('ORANGEHRM_BASE_URL', 'https://opensource-demo.orangehrmlive.com');

export const Links = {
  BASE_URL,
  HACKER_NEWS_NEWEST_PAGE: getRuntimeString('HACKER_NEWS_NEWEST_URL', 'https://news.ycombinator.com/newest'),
  LOGIN_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_LOGIN_PATH', '/web/index.php/auth/login')}`,
  DASHBOARD_PATH: getRuntimeString('ORANGEHRM_DASHBOARD_PATH', '/web/index.php/dashboard/index'),
  ADMIN_USERS_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_ADMIN_USERS_PATH', '/web/index.php/admin/viewSystemUsers')}`,
  ADMIN_USERS_API_PATH: getRuntimeString('ORANGEHRM_ADMIN_USERS_API_PATH', '/web/index.php/api/v2/admin/users'),
  BUZZ_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_BUZZ_PATH', '/web/index.php/buzz/viewBuzz')}`,
  BUZZ_FEED_API_PATH: getRuntimeString('ORANGEHRM_BUZZ_FEED_API_PATH', '/web/index.php/api/v2/buzz/feed'),
  DIRECTORY_PAGE: `${BASE_URL}${getRuntimeString('ORANGEHRM_DIRECTORY_PATH', '/web/index.php/directory/viewDirectory')}`,
  DIRECTORY_EMPLOYEES_API_PATH: getRuntimeString(
    'ORANGEHRM_DIRECTORY_EMPLOYEES_API_PATH',
    '/web/index.php/api/v2/directory/employees',
  ),
} as const;
