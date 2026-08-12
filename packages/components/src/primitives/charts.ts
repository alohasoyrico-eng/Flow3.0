const supportedChartTypes = new Set<string>(["sparkline", "bars", "line", "area", "donut", "pareto", "bullet", "comparison", "compact"]);
const chartMotion = {
  enterDuration: 260,
  updateDuration: 220,
  enterEasing: "cubicOut",
  updateEasing: "cubicOut",
};

type ChartRowInput = {
  id?: string;
  label?: string;
  value?: number | string;
  values?: Array<number | string>;
  series?: string;
  caption?: string;
};

type ChartSeriesModel = {
  id: string;
  label: string;
  values: number[];
};

type ChartTableRow = {
  label: string;
  value: number;
  series?: string;
};

type ChartSegmentRow = ChartTableRow & {
  id: string;
};

type ChartThreshold = {
  value?: number | string;
  [key: string]: unknown;
};

type ChartPrimitiveOptions = {
  type?: string;
  label?: string;
  value?: string;
  caption?: string;
  values?: Array<number | string>;
  labels?: string[];
  series?: ChartRowInput[];
  comparisons?: ChartRowInput[];
  segments?: ChartRowInput[];
  thresholds?: ChartThreshold[];
};

type EchartsOption = {
  animation: boolean;
  animationDuration: number;
  animationDurationUpdate: number;
  animationEasing: string;
  animationEasingUpdate: string;
  aria: { enabled: boolean; label: { description: string } };
  dataset: { source: Array<Record<string, unknown>> };
  grid?: Record<string, unknown> | undefined;
  legend?: Record<string, unknown> | undefined;
  series: Array<Record<string, unknown>>;
  tooltip: Record<string, unknown>;
  xAxis?: Record<string, unknown> | undefined;
  yAxis?: Record<string, unknown> | Array<Record<string, unknown>> | undefined;
};

function normalizeValues(values: Array<number | string> = []): number[] {
  return values.map(Number).map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0));
}

function normalizeSeries(series: ChartRowInput[] = [], fallbackValues: number[] = []): ChartSeriesModel[] {
  const normalized = series
    .map((item, index) => ({
      id: item.id ?? `series-${index + 1}`,
      label: item.label ?? "",
      values: normalizeValues(Array.isArray(item.values) ? item.values : []),
    }))
    .filter((item) => item.values.length);
  return normalized.length ? normalized : fallbackValues.length ? [{ id: "series-1", label: "", values: fallbackValues }] : [];
}

function normalizeSegments(segments: ChartRowInput[] = [], values: number[] = [], labels: string[] = []): ChartSegmentRow[] {
  const source: ChartRowInput[] = segments.length
    ? segments
    : values.map((item, index) => ({ label: labels[index] ?? "", value: item }));
  return source.map((item, index) => ({
    id: item.id ?? `segment-${index + 1}`,
    label: item.label ?? "",
    value: Number.isFinite(Number(item.value)) ? Math.max(0, Number(item.value)) : 0,
  }));
}

function createTextSummary({
  label,
  value,
  caption,
  type,
  rows,
}: {
  label: string;
  value: string;
  caption: string;
  type: string;
  rows: ChartTableRow[];
}): string {
  const points = rows.map((row) => row.label ? `${row.label}: ${row.value}` : String(row.value)).join(", ");
  return [label, value, caption, `${type} chart`, points].filter(Boolean).join(". ");
}

function createTableFallback(rows: ChartTableRow[] = []): ChartTableRow[] {
  return rows.map((row) => ({
    label: row.label,
    value: row.value,
    series: row.series ?? "",
  }));
}

export function createChartsPrimitive({
  type = "sparkline",
  label = "",
  value = "",
  caption = "",
  values = [],
  labels = [],
  series = [],
  comparisons = [],
  segments = [],
  thresholds = [],
}: ChartPrimitiveOptions = {}) {
  const resolvedType = type === "bar" ? "bars" : supportedChartTypes.has(type) ? type : "sparkline";
  const resolvedValues = normalizeValues(values);
  const resolvedLabels = labels.length ? labels : [];
  const lineSeries = normalizeSeries(series, resolvedValues);
  const comparisonSeries = normalizeSeries(comparisons.length ? comparisons : series, resolvedValues);
  const segmentRows = normalizeSegments(segments, resolvedValues, resolvedLabels);
  const baseRows = resolvedValues.map((item, index) => ({ label: resolvedLabels[index] ?? "", value: item }));
  const rows = resolvedType === "donut"
    ? segmentRows
    : resolvedType === "comparison"
      ? comparisonSeries.flatMap((item) => item.values.map((seriesValue, index) => ({
          label: resolvedLabels[index] ?? "",
          value: seriesValue,
          series: item.label,
        })))
      : baseRows;
  const tableFallback = createTableFallback(rows);
  const legendModel = resolvedType === "donut"
    ? segmentRows.map((item) => ({ id: item.id, label: item.label, value: item.value }))
    : lineSeries.map((item) => ({ id: item.id, label: item.label }));
  const axisData = resolvedLabels;
  const echartsOption: EchartsOption = {
    animation: true,
    animationDuration: chartMotion.enterDuration,
    animationDurationUpdate: chartMotion.updateDuration,
    animationEasing: chartMotion.enterEasing,
    animationEasingUpdate: chartMotion.updateEasing,
    aria: {
      enabled: true,
      label: {
        description: createTextSummary({ label, value, caption, type: resolvedType, rows: tableFallback }),
      },
    },
    dataset: {
      source: tableFallback,
    },
    grid: resolvedType === "donut" ? undefined : { left: 0, right: 0, top: 8, bottom: 0, containLabel: false },
    legend: ["donut", "line", "area", "comparison"].includes(resolvedType) ? { show: false, data: legendModel.map((item) => item.label) } : undefined,
    series: [],
    tooltip: {
      show: true,
      confine: true,
      trigger: ["bars", "comparison", "pareto", "bullet", "line", "area", "sparkline", "compact"].includes(resolvedType) ? "axis" : "item",
    },
    xAxis: resolvedType === "donut" ? undefined : { type: "category", data: axisData, show: false },
    yAxis: resolvedType === "donut" ? undefined : { type: "value", show: false },
  };

  if (["sparkline", "compact", "line", "area"].includes(resolvedType)) {
    echartsOption.series = lineSeries.slice(0, 3).map((item) => ({
      name: item.label,
      type: "line",
      data: item.values,
      smooth: true,
      showSymbol: false,
      areaStyle: resolvedType === "area" ? {} : undefined,
    }));
  } else if (resolvedType === "bars") {
    echartsOption.series = [{ name: label, type: "bar", data: resolvedValues, barCategoryGap: "36%" }];
  } else if (resolvedType === "comparison") {
    echartsOption.series = comparisonSeries.slice(0, 3).map((item) => ({ name: item.label, type: "bar", data: item.values }));
  } else if (resolvedType === "donut") {
    echartsOption.series = [{ name: label, type: "pie", radius: ["58%", "84%"], data: segmentRows.map((item) => ({ name: item.label, value: item.value })) }];
  } else if (resolvedType === "pareto") {
    const sorted = [...baseRows].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0) || 1;
    let cumulative = 0;
    echartsOption.xAxis = { type: "category", data: sorted.map((item) => item.label), show: false };
    echartsOption.yAxis = [{ type: "value", show: false }, { type: "value", min: 0, max: 100, show: false }];
    echartsOption.series = [
      { name: label, type: "bar", data: sorted.map((item) => item.value) },
      {
        name: "Cumulative",
        type: "line",
        yAxisIndex: 1,
        data: sorted.map((item) => {
          cumulative += item.value;
          return Math.round((cumulative / total) * 100);
        }),
      },
    ];
  } else if (resolvedType === "bullet") {
    const maxValue = Math.max(...resolvedValues, 100, ...thresholds.map((item) => Number(item.value)).filter(Number.isFinite));
    echartsOption.grid = { left: 0, right: 0, top: 0, bottom: 0, containLabel: false };
    echartsOption.xAxis = { type: "value", min: 0, max: maxValue, show: false };
    echartsOption.yAxis = { type: "category", data: resolvedLabels, show: false };
    echartsOption.series = [{
      name: label,
      type: "bar",
      data: resolvedValues,
      barCategoryGap: "42%",
      markLine: thresholds.length ? { symbol: "none", data: thresholds } : undefined,
    }];
  }

  return {
    type: resolvedType,
    echartsOption,
    textSummary: echartsOption.aria.label.description,
    legendModel,
    tableFallback,
  };
}
