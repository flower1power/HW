import { type Locator, type Page, expect } from '@playwright/test';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { HttpMethod, UiSelectors, UiText } from '../data/ui';
import { BasePage } from './base.page';

type CanvasScanline = {
  canvasWidth: number;
  alphaValues: number[];
};

const SCANLINE_POSITION = 0.5;
const MINIMUM_COLUMN_WIDTH = 4;
const COLUMN_WIDTH_DIVISOR = 50;

export class DashboardPage extends BasePage {
  protected readonly url = Links.DASHBOARD_PAGE;
  readonly weeklyAttendanceChart: Locator;

  constructor(page: Page) {
    super(page);

    const timeAtWorkWidget = page.locator(UiSelectors.DASHBOARD.GRID_ITEMS).filter({
      has: page.locator(UiSelectors.DASHBOARD.WIDGET_TITLE).getByText(UiText.DASHBOARD.TIME_AT_WORK_WIDGET, { exact: true }),
    });

    this.weeklyAttendanceChart = timeAtWorkWidget.locator(UiSelectors.DASHBOARD.WEEKLY_ATTENDANCE_CHART);
  }

  async waitForWeeklyAttendanceColumnCount(): Promise<number> {
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes(Links.DASHBOARD_TIME_AT_WORK_API_PATH) && response.request().method() === HttpMethod.GET,
    );

    const responseError = await response.finished();
    const errorMessage = Messages.DASHBOARD.TIME_AT_WORK_API_FAILED(response.status(), response.url());

    expect(responseError, errorMessage).toBeNull();
    expect(response.ok(), errorMessage).toBeTruthy();

    const payload: unknown = await response.json();

    if (!this.isTimeAtWorkResponse(payload)) {
      throw new Error(Messages.DASHBOARD.INVALID_TIME_AT_WORK_RESPONSE);
    }

    return payload.data.length;
  }

  async getRenderedWeeklyAttendanceColumnCount(): Promise<number> {
    // Шаг 1: получаем горизонтальный срез по центру реального canvas.
    const canvasScanline = await this.getWeeklyAttendanceCanvasScanline();
    if (!canvasScanline) {
      return 0;
    }

    // Шаг 2: считаем широкие непрозрачные области — визуальные столбцы диаграммы.
    return this.countColumnsInScanline(canvasScanline.alphaValues, canvasScanline.canvasWidth);
  }

  private async getWeeklyAttendanceCanvasScanline(): Promise<CanvasScanline | null> {
    // Шаг 3: читаем пиксели внутри страницы, где доступен 2D-контекст canvas.
    return this.weeklyAttendanceChart.evaluate((element, scanlinePosition) => {
      if (!(element instanceof HTMLCanvasElement)) {
        return null;
      }

      const context = element.getContext('2d');
      if (!context) {
        return null;
      }

      // Шаг 4: сохраняем только альфа-канал центральной строки.
      const y = Math.floor(element.height * scanlinePosition);
      const pixels = context.getImageData(0, y, element.width, 1).data;
      const rgbaChannelCount = 4;
      const alphaChannelOffset = 3;
      const alphaValues = Array.from({ length: element.width }, (_, x) => pixels[x * rgbaChannelCount + alphaChannelOffset] ?? 0);

      return {
        canvasWidth: element.width,
        alphaValues,
      };
    }, SCANLINE_POSITION);
  }

  private countColumnsInScanline(alphaValues: number[], canvasWidth: number): number {
    // Шаг 5: вычисляем минимальную ширину столбца и отбрасываем узкий шум.
    const minimumColumnWidth = Math.max(MINIMUM_COLUMN_WIDTH, Math.floor(canvasWidth / COLUMN_WIDTH_DIVISOR));

    // Шаг 6: готовим счётчики столбцов и текущей непрозрачной области.
    let columnCount = 0;
    let runWidth = 0;

    // Шаг 7: непрозрачные пиксели объединяем в непрерывные области.
    for (const alpha of alphaValues) {
      if (alpha > 0) {
        runWidth += 1;
        continue;
      }

      if (runWidth >= minimumColumnWidth) {
        columnCount += 1;
      }
      runWidth = 0;
    }

    // Шаг 8: учитываем область, дошедшую до правой границы canvas.
    return runWidth >= minimumColumnWidth ? columnCount + 1 : columnCount;
  }

  private isTimeAtWorkResponse(payload: unknown): payload is { data: unknown[] } {
    return typeof payload === 'object' && payload !== null && 'data' in payload && Array.isArray(payload.data);
  }
}
