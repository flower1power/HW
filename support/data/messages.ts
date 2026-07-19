export const Messages = {
  ADMIN_USERS: {
    NO_EMPLOYEE_NAMES_IN_TABLE: 'В таблице должен быть хотя бы один Employee Name',
    NO_SEARCHABLE_EMPLOYEE_NAME: (attemptedNames: string[]) =>
      `Не удалось найти searchable Employee Name из текущей таблицы. Проверенные имена: ${attemptedNames.join(', ')}`,
    SEARCH_RESULTS_MISMATCH: (employeeName: string) =>
      `В результатах должны быть только строки с Employee Name "${employeeName}"`,
    USERS_API_FAILED: (status: number, url: string) => `Запрос пользователей завершился с HTTP ${status}: ${url}`,
    TABLE_DID_NOT_UPDATE: 'Таблица пользователей должна обновиться после поискового запроса',
  },
  AUTH: {
    UNSUPPORTED_ROLE: (role: string) => `Роль ${role} не поддерживается для авторизации`,
  },
  DIRECTORY: {
    INVALID_RECORDS_COUNTER: (text: string) => `Не удалось получить количество записей из счётчика: "${text}"`,
    EMPLOYEE_CARDS_DID_NOT_LOAD: (previousCount: number) =>
      `Количество карточек сотрудников должно увеличиться после прокрутки (текущее количество: ${previousCount})`,
    EMPLOYEE_CARDS_COUNT_MISMATCH: (expected: number) =>
      `Количество карточек сотрудников должно совпадать со счётчиком записей (${expected})`,
  },
} as const;
