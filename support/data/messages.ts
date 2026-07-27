export const Messages = {
  HACKER_NEWS: {
    INVALID_STORY_TIMESTAMP: (value: string | null) => `Не удалось получить Unix timestamp новости из атрибута title: "${value}"`,
    STORIES_ARE_NOT_SORTED: 'Первые новости должны быть отсортированы от новых к старым',
  },
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
  BUZZ: {
    BUZZ_FEED_API_FAILED: (status: number, url: string) => `Запрос ленты Buzz завершился с HTTP ${status}: ${url}`,
    INVALID_COMMENT_COUNT: (value: string) => `Не удалось получить количество комментариев из текста: "${value}"`,
    NOT_ENOUGH_POSTS: 'В ленте Buzz должно быть хотя бы два поста для проверки сортировки',
    POSTS_ARE_NOT_SORTED_WITH_BUILT_IN_SORT:
      'Посты должны быть отсортированы по количеству комментариев по убыванию (проверка через Array.sort)',
    POSTS_ARE_NOT_SORTED_MANUALLY: (previousCount: number, currentCount: number, currentIndex: number) =>
      `Количество комментариев у поста ${currentIndex + 1} (${currentCount}) не должно превышать ` +
      `количество у предыдущего поста (${previousCount})`,
  },
  DIRECTORY: {
    INVALID_RECORDS_COUNTER: (text: string) => `Не удалось получить количество записей из счётчика: "${text}"`,
    EMPLOYEE_CARDS_DID_NOT_LOAD: (previousCount: number) =>
      `Количество карточек сотрудников должно увеличиться после прокрутки (текущее количество: ${previousCount})`,
    EMPLOYEE_CARDS_COUNT_MISMATCH: (expected: number) =>
      `Количество карточек сотрудников должно совпадать со счётчиком записей (${expected})`,
  },
} as const;
