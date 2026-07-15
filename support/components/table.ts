import { type Locator } from '@playwright/test';
import { BaseComponent } from './base';

export class Table extends BaseComponent {
  constructor(
    private readonly rows: Locator,
    private readonly cellSelector: string,
  ) {
    super(rows);
  }

  async getColumnValues(columnIndex: number): Promise<string[]> {
    const rows = await this.getRows();

    return rows
      .map((row) => row[columnIndex])
      .filter((cellText): cellText is string => cellText !== undefined && cellText.length > 0);
  }

  //Возвращает уникальные значения из указанной колонки.
  async getUniqueColumnValues(columnIndex: number): Promise<string[]> {
    return [...new Set(await this.getColumnValues(columnIndex))];
  }

  async getRows(): Promise<string[][]> {
    const rowCount = await this.rows.count();
    const tableRows: string[][] = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const row = this.rows.nth(rowIndex);
      const cells = row.locator(this.cellSelector);
      const cellCount = await cells.count();
      const rowValues: string[] = [];

      for (let cellIndex = 0; cellIndex < cellCount; cellIndex += 1) {
        rowValues.push((await cells.nth(cellIndex).innerText()).trim());
      }

      tableRows.push(rowValues);
    }

    return tableRows;
  }
}
