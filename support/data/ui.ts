export const UiText = {
  LOGIN: {
    USERNAME_FIELD: 'Username',
    PASSWORD_FIELD: 'Password',
    LOGIN_BUTTON: 'Login',
  },
  ADMIN_USERS: {
    EMPLOYEE_NAME_PLACEHOLDER: 'Type for hints...',
    SEARCH_BUTTON: 'Search',
    SEARCHING_OPTION_PATTERN: /Searching/i,
    RECORDS_COUNTER_PATTERN: /Record Found|Records Found|No Records Found/,
  },
} as const;

export const UiSelectors = {
  LOGIN: {
    USERNAME_FIELD: 'input[name="username"]',
    PASSWORD_FIELD: 'input[name="password"]',
    LOGIN_BUTTON: 'button[type="submit"]',
  },
  ADMIN_USERS: {
    EMPLOYEE_NAME_FIELD: 'input[placeholder="Type for hints..."]',
    EMPLOYEE_NAME_OPTIONS_LIST: '.oxd-autocomplete-dropdown',
    EMPLOYEE_NAME_OPTION: '.oxd-autocomplete-option',
    SEARCH_BUTTON: 'button[type="submit"]',
    TABLE_ROWS: '.oxd-table-body .oxd-table-card .oxd-table-row',
    TABLE_CELL: '.oxd-table-cell',
    RECORDS_COUNTER_CONTAINER: '.orangehrm-horizontal-padding',
    LOADING_SPINNER: '.oxd-loading-spinner',
  },
} as const;

export const UiTableColumns = {
  ADMIN_USERS: {
    EMPLOYEE_NAME: 3,
  },
} as const;

export const UiKeys = {
  ESCAPE: 'Escape',
} as const;

export const HttpMethod = {
  GET: 'GET',
} as const;
