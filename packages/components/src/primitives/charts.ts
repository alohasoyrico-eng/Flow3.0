const supportedChartTypes = new Set<string>([
  "sparkline",
  "compact",
  "line",
  "area",
  "bars",
  "bar",
  "stackedBar",
  "stacked100",
  "donut",
  "pie",
  "comparison",
  "scatter",
  "heatmap",
  "radar",
  "waterfall",
  "pareto",
  "gauge",
  "funnel",
  "treemap",
  "boxplot",
]);

const chartMotion = {
  enterDuration: 620,
  updateDuration: 220,
  enterEasing: "cubicOut",
  updateEasing: "cubicOut",
};

const chartPalette = [
  "var(--component-chart-series-primary)",
  "var(--component-chart-series-secondary)",
  "var(--component-chart-series-tertiary)",
  "var(--component-chart-series-quaternary)",
  "var(--component-chart-series-mixed)",
  "var(--component-chart-threshold-warning)",
];

const chartRamp = [
  "var(--component-chart-series-tertiary)",
  "var(--component-chart-series-mixed)",
  "var(--component-chart-series-primary)",
  "var(--component-chart-series-secondary)",
  "var(--component-chart-threshold-warning)",
];

function chartTooltipMarkerClass(index: number, mode: "series" | "ramp" = "series"): string {
  const size = mode === "ramp" ? chartRamp.length : chartPalette.length;
  return `chart-panel__echarts-tooltip-swatch--${mode}-${(index % size) + 1}`;
}

function chartTooltipIcon(type: string, label: string | undefined, index = 0): string {
  const normalizedLabel = String(label ?? "").toLowerCase();
  if (normalizedLabel.includes("ev") || normalizedLabel.includes("energy") || normalizedLabel.includes("charge")) return "bolt";
  if (normalizedLabel.includes("bike")) return "pedal_bike";
  if (normalizedLabel.includes("fuel") || normalizedLabel.includes("diesel")) return "local_gas_station";
  if (normalizedLabel.includes("route") || normalizedLabel.includes("sla")) return "route";
  if (normalizedLabel.includes("delay") || normalizedLabel.includes("risk") || normalizedLabel.includes("alert")) return "warning";
  if (normalizedLabel.includes("card") || normalizedLabel.includes("wallet") || normalizedLabel.includes("payment")) return "payments";
  if (type === "funnel") return ["filter_alt", "sell", "assignment_turned_in", "local_shipping", "task_alt"][index % 5] ?? "filter_alt";
  if (type === "treemap") return "domain";
  if (type === "donut" || type === "pie") return "donut_large";
  if (type === "scatter") return "scatter_plot";
  if (type === "waterfall") return "waterfall_chart";
  return "bar_chart";
}

type ChartDataItem = {
  label?: string;
  name?: string;
  value?: number | string;
  y?: number | string;
  values?: unknown[];
  color?: string;
  children?: ChartDataItem[];
  tooltipMarkerClass?: string;
  tooltipIcon?: string;
};

type ChartRowInput = {
  id?: string;
  label?: string;
  name?: string;
  value?: number | string;
  values?: unknown[];
  data?: ChartDataItem[] | undefined;
  color?: string | undefined;
  symbolSize?: number | undefined;
  series?: string;
  caption?: string;
};

type ChartSeriesModel = {
  id: string;
  label: string;
  values: unknown[];
  data?: ChartDataItem[] | undefined;
  color?: string | undefined;
  symbolSize?: number | undefined;
};

type ChartTableRow = {
  label: string;
  value: number | string;
  series?: string;
};

type ChartSegmentRow = {
  id: string;
  label: string;
  value: number;
  color?: string | undefined;
};

type ChartTooltipDatum = {
  name?: string;
  value: number | number[];
  tooltipIcon?: string;
  tooltipMarkerClass: string;
  itemStyle: Record<string, unknown>;
  emphasis?: Record<string, unknown>;
};

type ChartMatrix = {
  rows: string[];
  cols: string[];
  values: Array<[number, number, number]>;
};

type ChartIndicator = string | { name: string; max?: number };

type ChartThreshold = {
  value?: number | string;
  [key: string]: unknown;
};

type ChartPaletteMode = "auto" | "duo" | "categorical";
type ChartTooltipMarkerMode = "series" | "ramp";

type ChartPrimitiveOptions = {
  type?: string;
  label?: string;
  value?: string;
  caption?: string;
  values?: unknown[];
  labels?: string[];
  series?: ChartRowInput[];
  comparisons?: ChartRowInput[];
  segments?: ChartRowInput[];
  matrix?: ChartMatrix;
  indicators?: ChartIndicator[];
  thresholds?: ChartThreshold[];
  target?: number;
  min?: number;
  max?: number;
  totals?: number[];
  legend?: boolean;
  stack?: boolean;
  horizontal?: boolean;
  showValues?: boolean;
  palette?: ChartPaletteMode;
};

type EchartsOption = {
  animation: boolean;
  animationDuration: number;
  animationDurationUpdate: number;
  animationEasing: string;
  animationEasingUpdate: string;
  aria: { enabled: boolean; label: { description: string } };
  dataset: { source: Array<Record<string, unknown>> };
  color?: string[];
  grid?: Record<string, unknown> | undefined;
  legend?: Record<string, unknown> | undefined;
  radar?: Record<string, unknown> | undefined;
  visualMap?: Record<string, unknown> | undefined;
  series: Array<Record<string, unknown>>;
  tooltip: Record<string, unknown>;
  xAxis?: Record<string, unknown> | undefined;
  yAxis?: Record<string, unknown> | Array<Record<string, unknown>> | undefined;
};

function toFiniteNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizePositiveValues(values: unknown[] = []): number[] {
  return values.map((item) => Math.max(0, toFiniteNumber(item)));
}

function normalizeSignedValues(values: unknown[] = []): number[] {
  return values.map((item) => toFiniteNumber(item));
}

function normalizePointValues(values: unknown[] = []): Array<[number, number]> {
  return values
    .map((item) => Array.isArray(item) ? [toFiniteNumber(item[0]), toFiniteNumber(item[1])] as [number, number] : null)
    .filter((item): item is [number, number] => Boolean(item));
}

function normalizeSeriesPoints(series: ChartSeriesModel): Array<[number, number]> {
  if (series.data?.length) {
    return series.data.map((item) => [toFiniteNumber(item.value), toFiniteNumber(item.y)] as [number, number]);
  }
  return normalizePointValues(series.values);
}

function normalizeBoxValues(values: unknown[] = []): number[][] {
  return values
    .map((item) => Array.isArray(item) ? item.slice(0, 5).map((part) => toFiniteNumber(part)) : null)
    .filter((item): item is number[] => Array.isArray(item) && item.length >= 5);
}

function normalizeSeriesBoxValues(series: ChartSeriesModel): number[][] {
  if (series.data?.length) return normalizeBoxValues(series.data.map((item) => item.values));
  return normalizeBoxValues(series.values);
}

function normalizeSeries(series: ChartRowInput[] = [], fallbackValues: unknown[] = []): ChartSeriesModel[] {
  const normalized = series
    .map((item, index) => ({
      id: item.id ?? `series-${index + 1}`,
      label: item.label ?? item.name ?? "",
      values: Array.isArray(item.values) ? item.values : [],
      data: Array.isArray(item.data) ? item.data : undefined,
      color: item.color,
      symbolSize: item.symbolSize,
    }))
    .filter((item) => item.values.length || item.data?.length);
  return normalized.length
    ? normalized
    : fallbackValues.length
      ? [{ id: "series-1", label: "", values: fallbackValues }]
      : [];
}

function normalizeSegments(segments: ChartRowInput[] = [], values: unknown[] = [], labels: string[] = []): ChartSegmentRow[] {
  const source: ChartRowInput[] = segments.length
    ? segments
    : values.map((item, index) => ({ label: labels[index] ?? "", value: toFiniteNumber(item) }));
  return source.map((item, index) => ({
    id: item.id ?? `segment-${index + 1}`,
    label: item.label ?? item.name ?? "",
    value: Math.max(0, toFiniteNumber(item.value)),
    color: item.color,
  }));
}

function normalizeDataItems(series: ChartSeriesModel[] = [], values: unknown[] = [], labels: string[] = []): ChartDataItem[] {
  const seriesData = series[0]?.data;
  if (seriesData?.length) return seriesData;
  return values.map((item, index) => ({
    label: labels[index] ?? String(index + 1),
    value: Math.max(0, toFiniteNumber(item)),
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

function seriesColor(index: number, mode: ChartPaletteMode, count: number): string {
  if (mode === "categorical" || count > 3) return chartPalette[index % chartPalette.length] ?? chartPalette[0] ?? "var(--component-chart-series-primary)";
  if (index === 1) return "var(--component-chart-threshold-warning)";
  if (index === 2) return "var(--component-chart-series-tertiary)";
  return chartPalette[0] ?? "var(--component-chart-series-primary)";
}

function chartTooltipDatum({
  value,
  name,
  type,
  index,
  markerIndex = index,
  markerMode = "series",
}: {
  value: number | number[];
  name?: string;
  type: string;
  index: number;
  markerIndex?: number;
  markerMode?: ChartTooltipMarkerMode;
}): Pick<ChartTooltipDatum, "name" | "value" | "tooltipIcon" | "tooltipMarkerClass"> {
  const datum: Pick<ChartTooltipDatum, "name" | "value" | "tooltipIcon" | "tooltipMarkerClass"> = {
    value,
    tooltipIcon: chartTooltipIcon(type, name, index),
    tooltipMarkerClass: chartTooltipMarkerClass(markerIndex, markerMode),
  };
  if (name !== undefined) datum.name = name;
  return datum;
}

function baseSeriesRows(series: ChartSeriesModel[], labels: string[], values: unknown[] = []): ChartTableRow[] {
  if (series.length) {
    return series.flatMap((item) => item.values.map((seriesValue, index) => ({
      label: labels[index] ?? String(index + 1),
      value: Array.isArray(seriesValue) ? seriesValue.join(", ") : toFiniteNumber(seriesValue),
      series: item.label,
    })));
  }
  return normalizePositiveValues(values).map((item, index) => ({ label: labels[index] ?? String(index + 1), value: item }));
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
  matrix,
  thresholds = [],
  target,
  min,
  max,
  totals = [],
  legend = false,
  stack = false,
  horizontal = false,
  showValues = false,
  palette = "auto",
  indicators = [],
}: ChartPrimitiveOptions = {}) {
  void thresholds;
  const resolvedType = type === "bar" ? "bars" : supportedChartTypes.has(type) ? type : "sparkline";
  const resolvedValues = resolvedType === "waterfall" ? normalizeSignedValues(values) : normalizePositiveValues(values);
  const resolvedLabels = labels.length ? labels : resolvedValues.map(() => "");
  const lineSeries = normalizeSeries(series, resolvedValues);
  const comparisonSeries = normalizeSeries(comparisons.length ? comparisons : series, resolvedValues);
  const segmentRows = normalizeSegments(segments, resolvedValues, resolvedLabels);
  const dataItems = normalizeDataItems(lineSeries, resolvedValues, resolvedLabels);
  const matrixModel = matrix ?? { rows: [], cols: [], values: [] };
  const rows = resolvedType === "donut" || resolvedType === "pie" || resolvedType === "funnel" || resolvedType === "treemap"
    ? segmentRows.map((item, index) => ({ label: item.label || resolvedLabels[index] || String(index + 1), value: item.value }))
    : resolvedType === "gauge"
      ? [{ label: label || caption || "Value", value: toFiniteNumber(value) }]
    : resolvedType === "heatmap"
      ? matrixModel.values.map((item) => ({
          label: `${matrixModel.cols[item[0]] ?? item[0]} / ${matrixModel.rows[item[1]] ?? item[1]}`,
          value: item[2],
        }))
      : resolvedType === "boxplot"
        ? normalizeSeriesBoxValues(lineSeries[0] ?? { id: "series-1", label: "", values: [] }).map((item, index) => ({
            label: lineSeries[0]?.data?.[index]?.label ?? resolvedLabels[index] ?? String(index + 1),
            value: item.join(", "),
          }))
      : resolvedType === "comparison"
        ? comparisonSeries.flatMap((item) => item.values.map((seriesValue, index) => ({
            label: resolvedLabels[index] ?? String(index + 1),
            value: toFiniteNumber(seriesValue),
            series: item.label,
          })))
        : resolvedType === "scatter"
          ? lineSeries.flatMap((item) => normalizeSeriesPoints(item).map((point) => ({
              label: point.join(", "),
              value: point.join(", "),
              series: item.label,
            })))
          : baseSeriesRows(lineSeries, resolvedLabels, resolvedValues);
  const tableFallback = createTableFallback(rows);
  const legendModel = resolvedType === "donut" || resolvedType === "pie"
    ? segmentRows.map((item) => ({ id: item.id, label: item.label, value: item.value }))
    : lineSeries.map((item) => ({ id: item.id, label: item.label }));
  const textStyle = {
    color: "var(--component-chart-axis-color)",
    fontFamily: "var(--component-font-family-body)",
    fontSize: 12,
  };
  const monoTextStyle = {
    color: "var(--component-chart-axis-color)",
    fontFamily: "var(--component-font-family-mono)",
    fontSize: 11,
  };
  const valueAxisLabels = resolvedType === "line" || resolvedType === "area" || resolvedType === "waterfall" || resolvedType === "pareto" || resolvedType === "boxplot";
  const categoryAxis = {
    type: "category",
    data: resolvedLabels,
    boundaryGap: ["bars", "stackedBar", "stacked100", "comparison", "waterfall", "pareto", "boxplot"].includes(resolvedType),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { ...textStyle, hideOverlap: true, margin: 12 },
  };
  const valueAxis = {
    type: "value",
    min,
    max,
    splitNumber: 3,
    splitLine: { lineStyle: { color: "var(--component-chart-grid-color)", type: "dashed" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { ...monoTextStyle, show: valueAxisLabels, margin: 12 },
  };
  const echartsOption: EchartsOption = {
    animation: true,
    animationDuration: chartMotion.enterDuration,
    animationDurationUpdate: chartMotion.updateDuration,
    animationEasing: chartMotion.enterEasing,
    animationEasingUpdate: chartMotion.updateEasing,
    color: lineSeries.map((item, index) => item.color ?? seriesColor(index, palette, lineSeries.length)),
    aria: {
      enabled: true,
      label: {
        description: createTextSummary({ label, value, caption, type: resolvedType, rows: tableFallback }),
      },
    },
    dataset: {
      source: tableFallback,
    },
    grid: ["donut", "pie", "gauge", "funnel", "treemap", "radar"].includes(resolvedType)
      ? undefined
      : { left: 8, right: resolvedType === "pareto" ? 26 : 14, top: 14, bottom: legend ? 34 : resolvedType === "heatmap" ? 46 : 6, containLabel: true },
    legend: legend || ["donut", "pie", "line", "area", "comparison"].includes(resolvedType) ? {
      show: Boolean(legend),
      bottom: 0,
      left: "center",
      itemGap: 14,
      itemWidth: 12,
      itemHeight: 8,
      data: legendModel.map((item) => item.label),
      textStyle,
    } : undefined,
    series: [],
    tooltip: {
      show: true,
      confine: true,
      trigger: ["donut", "pie", "scatter", "gauge", "funnel", "treemap", "boxplot", "radar"].includes(resolvedType) ? "item" : "axis",
      backgroundColor: "var(--component-chart-tooltip-bg)",
      borderWidth: 0,
      padding: [9, 12],
      textStyle: {
        color: "var(--component-chart-tooltip-fg)",
        fontFamily: "var(--component-font-family-body)",
        fontSize: 12,
      },
      axisPointer: {
        type: ["bars", "comparison", "stackedBar", "stacked100", "waterfall", "pareto"].includes(resolvedType) ? "shadow" : "line",
        lineStyle: {
          color: "var(--component-chart-axis-color)",
          width: 1,
        },
      },
    },
    xAxis: ["donut", "pie", "gauge", "funnel", "treemap", "radar"].includes(resolvedType) ? undefined : categoryAxis,
    yAxis: ["donut", "pie", "gauge", "funnel", "treemap", "radar"].includes(resolvedType) ? undefined : valueAxis,
  };

  if (["sparkline", "compact", "line", "area"].includes(resolvedType)) {
    echartsOption.xAxis = { ...categoryAxis, show: resolvedType !== "sparkline" && resolvedType !== "compact" };
    echartsOption.yAxis = { ...valueAxis, show: resolvedType !== "sparkline" && resolvedType !== "compact" };
    echartsOption.series = lineSeries.slice(0, 3).map((item, index) => {
      const color = item.color ?? seriesColor(index, palette, lineSeries.length);
      return {
        name: item.label,
        type: "line",
        data: normalizePositiveValues(item.values).map((point, valueIndex) => chartTooltipDatum({
          value: point,
          name: resolvedLabels[valueIndex] ?? String(valueIndex + 1),
          type: resolvedType,
          index,
        })),
        smooth: 0.35,
        showSymbol: false,
        symbolSize: 7,
        lineStyle: {
          color,
          width: resolvedType === "sparkline" || resolvedType === "compact" ? 2 : 2.5,
          cap: "round",
          join: "round",
        },
        itemStyle: { color },
        areaStyle: resolvedType === "area" ? { color, opacity: 0.18 } : undefined,
        stack: stack ? "total" : undefined,
      };
    });
  } else if (["bars", "stackedBar"].includes(resolvedType)) {
    const stacked = resolvedType === "stackedBar" || stack;
    echartsOption.xAxis = horizontal ? { ...valueAxis, axisLabel: { ...monoTextStyle, show: false, margin: 12 } } : categoryAxis;
    echartsOption.yAxis = horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis, axisLabel: { ...monoTextStyle, show: false, margin: 12 } };
    echartsOption.series = lineSeries.map((item, index) => {
      const color = item.color ?? seriesColor(index, palette, lineSeries.length);
      return {
        name: item.label || label,
        type: "bar",
        data: normalizePositiveValues(item.values).map((point, valueIndex) => chartTooltipDatum({
          value: point,
          name: resolvedLabels[valueIndex] ?? String(valueIndex + 1),
          type: resolvedType,
          index,
        })),
        stack: stacked ? "total" : undefined,
        barCategoryGap: "38%",
        barMaxWidth: 34,
        itemStyle: {
          color,
          borderRadius: stacked ? 0 : horizontal ? [0, 17, 17, 0] : [17, 17, 0, 0],
        },
        label: showValues ? { show: true, position: horizontal ? "right" : "top", ...monoTextStyle } : { show: false },
      };
    });
  } else if (resolvedType === "stacked100") {
    echartsOption.xAxis = horizontal ? { ...valueAxis, max: 100, axisLabel: { ...monoTextStyle, show: false, margin: 12 } } : categoryAxis;
    echartsOption.yAxis = horizontal ? { ...categoryAxis, inverse: true } : { ...valueAxis, max: 100, axisLabel: { ...monoTextStyle, show: false, margin: 12 } };
    const pointCount = Math.max(...lineSeries.map((item) => item.values.length), 0);
    const totalsByIndex = Array.from({ length: pointCount }, (_item, index) => {
      const total = lineSeries.reduce((sum, item) => sum + Math.max(0, toFiniteNumber(item.values[index])), 0);
      return total || 1;
    });
    echartsOption.series = lineSeries.map((item, index) => {
      const color = item.color ?? seriesColor(index, palette, lineSeries.length);
      return {
        name: item.label,
        type: "bar",
        stack: "total",
        data: item.values.map((seriesValue, valueIndex) => chartTooltipDatum({
          value: Math.round((Math.max(0, toFiniteNumber(seriesValue)) / (totalsByIndex[valueIndex] ?? 1)) * 100),
          name: resolvedLabels[valueIndex] ?? String(valueIndex + 1),
          type: resolvedType,
          index,
        })),
        barMaxWidth: 34,
        itemStyle: { color },
      };
    });
  } else if (resolvedType === "comparison") {
    echartsOption.series = comparisonSeries.slice(0, 3).map((item, index) => ({
      name: item.label,
      type: "bar",
      data: normalizePositiveValues(item.values).map((point, valueIndex) => chartTooltipDatum({
        value: point,
        name: resolvedLabels[valueIndex] ?? String(valueIndex + 1),
        type: resolvedType,
        index,
      })),
      barCategoryGap: "34%",
      barMaxWidth: 24,
      itemStyle: {
        color: item.color ?? seriesColor(index, palette, comparisonSeries.length),
        borderRadius: [12, 12, 0, 0],
      },
    }));
  } else if (resolvedType === "donut" || resolvedType === "pie") {
    echartsOption.series = [{
      name: label,
      type: "pie",
      radius: resolvedType === "donut" ? ["58%", "84%"] : ["0%", "80%"],
      center: legend ? ["50%", "46%"] : ["50%", "52%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: "var(--component-color-surface)",
        borderRadius: 4,
        borderWidth: 2,
      },
      label: { show: false, ...textStyle },
      labelLine: { lineStyle: { color: "var(--component-chart-axis-color)" } },
      emphasis: { scale: true, scaleSize: 4 },
      data: segmentRows.map((item, index) => {
        const itemLabel = item.label || resolvedLabels[index] || String(index + 1);
        const color = item.color ?? seriesColor(index, "categorical", segmentRows.length);
        return {
          name: itemLabel,
          value: item.value,
          tooltipIcon: chartTooltipIcon(resolvedType, itemLabel, index),
          tooltipMarkerClass: chartTooltipMarkerClass(index),
          itemStyle: { color },
          emphasis: { itemStyle: { color, borderColor: "var(--component-color-focus)", borderWidth: 2 } },
        };
      }),
    }];
  } else if (resolvedType === "scatter") {
    echartsOption.xAxis = { ...valueAxis, axisLabel: { ...monoTextStyle, show: true, margin: 12 } };
    echartsOption.yAxis = { ...valueAxis, axisLabel: { ...monoTextStyle, show: true, margin: 12 } };
    echartsOption.series = lineSeries.map((item, index) => ({
      name: item.label,
      type: "scatter",
      data: normalizeSeriesPoints(item).map((point) => chartTooltipDatum({
        value: point,
        name: item.label,
        type: resolvedType,
        index,
      })),
      symbolSize: item.symbolSize ?? 10,
      itemStyle: { color: item.color ?? seriesColor(index, palette, lineSeries.length), opacity: 0.78 },
      emphasis: { focus: "series", itemStyle: { opacity: 1 } },
    }));
  } else if (resolvedType === "heatmap") {
    const heatValues = matrixModel.values.map((item) => item[2]);
    echartsOption.xAxis = { ...categoryAxis, data: matrixModel.cols, boundaryGap: true };
    echartsOption.yAxis = { ...categoryAxis, data: matrixModel.rows, boundaryGap: true, inverse: true, axisLabel: { ...textStyle, show: true, margin: 10 } };
    echartsOption.visualMap = {
      show: false,
      min: Math.min(...heatValues, 0),
      max: Math.max(...heatValues, 1),
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemWidth: 11,
      itemHeight: 90,
      inRange: { color: chartRamp },
      textStyle: monoTextStyle,
    };
    echartsOption.series = [{
      name: label,
      type: "heatmap",
      data: matrixModel.values,
      label: { show: true, color: "var(--component-chart-tooltip-fg)", fontFamily: "var(--component-font-family-mono)", fontSize: 10, fontWeight: 700 },
      itemStyle: { borderColor: "var(--component-color-surface)", borderWidth: 2, borderRadius: 6 },
      emphasis: { itemStyle: { borderColor: "var(--component-chart-axis-color)", borderWidth: 1.5 } },
    }];
  } else if (resolvedType === "radar") {
    const radarIndicators = (indicators.length ? indicators : resolvedLabels).map((item) => typeof item === "string" ? { name: item, max: max ?? 100 } : item);
    echartsOption.radar = {
      indicator: radarIndicators,
      radius: "66%",
      splitNumber: 4,
      axisName: textStyle,
      splitLine: { lineStyle: { color: "var(--component-chart-grid-color)", type: "dashed" } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: "var(--component-chart-grid-color)" } },
    };
    echartsOption.series = [{
      name: label,
      type: "radar",
      data: lineSeries.map((item, index) => {
        const color = item.color ?? seriesColor(index, palette, lineSeries.length);
        return {
          name: item.label,
        ...chartTooltipDatum({
          value: normalizePositiveValues(item.values),
          name: item.label,
          type: resolvedType,
          index,
        }),
        lineStyle: { color, width: 2.25, join: "round" },
          itemStyle: { color },
          areaStyle: { color, opacity: 0.16 },
        };
      }),
    }];
  } else if (resolvedType === "waterfall") {
    const signed = normalizeSignedValues(lineSeries[0]?.values.length ? lineSeries[0].values : values);
    const helper: number[] = [];
    const bars: ChartTooltipDatum[] = [];
    let running = 0;
    signed.forEach((item, index) => {
      const isTotal = totals.includes(index);
      if (isTotal) {
        const absolute = item !== 0 ? item : running;
        helper.push(0);
        bars.push({ value: absolute, tooltipIcon: chartTooltipIcon(resolvedType, resolvedLabels[index], index), tooltipMarkerClass: "chart-panel__echarts-tooltip-swatch--series-5", itemStyle: { color: "var(--component-chart-series-mixed)", borderRadius: 6 }, emphasis: { itemStyle: { color: "var(--component-chart-series-mixed)", borderColor: "var(--component-color-focus)", borderWidth: 1.5 } } });
        running = absolute;
        return;
      }
      helper.push(item >= 0 ? running : running + item);
      bars.push({
        value: Math.abs(item),
        tooltipIcon: chartTooltipIcon(resolvedType, resolvedLabels[index], index),
        tooltipMarkerClass: item >= 0 ? "chart-panel__echarts-tooltip-swatch--series-2" : "chart-panel__echarts-tooltip-swatch--danger",
        itemStyle: {
          color: item >= 0 ? "var(--component-chart-series-secondary)" : "var(--component-chart-threshold-danger)",
          borderRadius: 6,
        },
        emphasis: { itemStyle: { color: item >= 0 ? "var(--component-chart-series-secondary)" : "var(--component-chart-threshold-danger)", borderColor: "var(--component-color-focus)", borderWidth: 1.5 } },
      });
      running += item;
    });
    echartsOption.series = [
      { name: "__helper", type: "bar", stack: "waterfall", silent: true, itemStyle: { color: "transparent" }, data: helper, animation: false },
      { name: lineSeries[0]?.label || label, type: "bar", stack: "waterfall", barMaxWidth: 38, data: bars },
    ];
  } else if (resolvedType === "pareto") {
    const paretoValues = normalizePositiveValues(lineSeries[0]?.values.length ? lineSeries[0].values : values);
    const total = paretoValues.reduce((sum, item) => sum + item, 0) || 1;
    let accumulated = 0;
    const cumulative = paretoValues.map((item) => {
      accumulated += item;
      return Number(((accumulated / total) * 100).toFixed(1));
    });
    echartsOption.yAxis = [
      valueAxis,
      { ...valueAxis, max: 100, axisLabel: { ...monoTextStyle, show: true, margin: 12 }, splitLine: { show: false } },
    ];
    echartsOption.series = [
      {
        name: lineSeries[0]?.label || "Frequency",
        type: "bar",
        barMaxWidth: 34,
        data: paretoValues.map((point, index) => chartTooltipDatum({
          value: point,
          name: resolvedLabels[index] ?? String(index + 1),
          type: resolvedType,
          index,
          markerIndex: 4,
        })),
        itemStyle: { color: "var(--component-chart-series-mixed)", borderRadius: [17, 17, 0, 0] },
      },
      {
        name: "Cumulative",
        type: "line",
        yAxisIndex: 1,
        data: cumulative.map((point, index) => chartTooltipDatum({
          value: point,
          name: resolvedLabels[index] ?? String(index + 1),
          type: resolvedType,
          index,
          markerIndex: 5,
        })),
        smooth: false,
        lineStyle: { color: "var(--component-chart-threshold-warning)", width: 2.25, cap: "round", join: "round" },
        itemStyle: { color: "var(--component-chart-threshold-warning)" },
        symbolSize: 6,
      },
    ];
  } else if (resolvedType === "gauge") {
    const gaugeValue = target ?? toFiniteNumber(lineSeries[0]?.values[0] ?? values[0]);
    const gaugeMax = max ?? 100;
    echartsOption.tooltip = { show: false };
    echartsOption.series = [{
      type: "gauge",
      startAngle: 200,
      endAngle: -20,
      min: min ?? 0,
      max: gaugeMax,
      radius: "96%",
      center: ["50%", "62%"],
      progress: { show: true, width: 14, roundCap: true, itemStyle: { color: gaugeValue / gaugeMax >= 0.85 ? "var(--component-chart-threshold-danger)" : chartPalette[0] } },
      axisLine: { lineStyle: { width: 14, color: [[1, "var(--component-chart-grid-color)"]] }, roundCap: true },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, "-6%"],
        fontFamily: "var(--component-font-family-mono)",
        fontSize: 26,
        fontWeight: 300,
        color: "var(--component-color-text)",
      },
      data: [{ value: gaugeValue }],
    }];
  } else if (resolvedType === "funnel") {
    echartsOption.series = [{
      name: label,
      type: "funnel",
      left: "4%",
      right: "4%",
      top: legend ? 34 : 10,
      bottom: 6,
      minSize: "24%",
      gap: 2,
      sort: "descending",
      data: segmentRows.map((item, index) => {
        const itemLabel = item.label || resolvedLabels[index] || String(index + 1);
        const rampIndex = Math.max(0, chartRamp.length - 1 - index);
        const color = chartRamp[rampIndex] ?? chartPalette[index % chartPalette.length] ?? chartPalette[0];
        return {
          name: itemLabel,
          value: item.value,
          tooltipIcon: chartTooltipIcon(resolvedType, itemLabel, index),
          tooltipMarkerClass: chartTooltipMarkerClass(rampIndex, "ramp"),
          itemStyle: { color, borderWidth: 0, borderRadius: 4 },
          emphasis: { itemStyle: { color, borderColor: "var(--component-color-focus)", borderWidth: 1.5 } },
        };
      }),
      label: { show: true, position: "inside", color: "var(--component-color-text-on-inverse)", fontFamily: "var(--component-font-family-body)", fontSize: 12, fontWeight: 600 },
    }];
  } else if (resolvedType === "treemap") {
    echartsOption.series = [{
      name: label,
      type: "treemap",
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      left: 0,
      right: 0,
      top: legend ? 34 : 0,
      bottom: 0,
      itemStyle: { borderColor: "var(--component-color-surface)", borderWidth: 2, gapWidth: 2, borderRadius: 4 },
      label: { color: "var(--component-color-text-on-inverse)", fontFamily: "var(--component-font-family-body)", fontSize: 12, fontWeight: 600 },
      data: segmentRows.map((item, index) => {
        const itemLabel = item.label || resolvedLabels[index] || String(index + 1);
        const color = item.color ?? seriesColor(index, "categorical", segmentRows.length);
        return {
          name: itemLabel,
          value: item.value,
          tooltipIcon: chartTooltipIcon(resolvedType, itemLabel, index),
          tooltipMarkerClass: chartTooltipMarkerClass(index),
          itemStyle: { color },
          emphasis: { itemStyle: { color, borderColor: "var(--component-color-focus)", borderWidth: 1.5 } },
        };
      }),
    }];
  } else if (resolvedType === "boxplot") {
    echartsOption.xAxis = { ...categoryAxis, boundaryGap: true };
    echartsOption.yAxis = { ...valueAxis, axisLabel: { ...monoTextStyle, show: true, margin: 12 } };
    echartsOption.series = [{
      name: label,
      type: "boxplot",
      data: normalizeSeriesBoxValues(lineSeries[0] ?? { id: "series-1", label: "", values }),
      itemStyle: { color: "var(--component-color-surface)", borderColor: "var(--component-chart-axis-color)", borderWidth: 1.5 },
      emphasis: { itemStyle: { borderColor: chartPalette[0], borderWidth: 2 } },
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
