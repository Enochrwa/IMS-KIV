import {
  differenceInDays,
  differenceInYears,
  endOfDay,
  format,
  isToday,
  startOfYear
} from "date-fns";

export const getMetricPeriodLabel = (start: Date, end: Date): string => {
  const today = endOfDay(new Date());
  const totalDays = differenceInDays(end, start);
  const totalYears = differenceInYears(end, start);

  // === Common quick ranges ===
  if (isToday(start) && isToday(end)) return "today";
  if (totalDays === 0) return "1 day";
  if (totalDays === 6) return "last 7 days";
  if (totalDays === 29) return "last 30 days";
  if (start.getTime() === startOfYear(today).getTime() && isToday(end))
    return "YTD";
  if (totalYears === 1 && isToday(end)) return "last 12 months";
  if (totalYears === 5 && isToday(end)) return "last 5 years";

  // === Custom Range Duration ===
  // Convert to months and years, rounded to 1 decimal if mixed
  const days = totalDays;
  const months = days / 30.44; // avg month length
  const years = days / 365.25; // avg year length

  let label: string;

  if (days < 30) {
    label = `${days} ${days > 1 ? "days" : "day"}`;
  } else if (days < 365) {
    label = `${parseFloat(months.toFixed(1))} ${
      months > 1 ? "months" : "month"
    }`;
  } else {
    label = `${parseFloat(years.toFixed(1))} ${years > 1 ? "years" : "year"}`;
  }

  // === Fallback for same-month-year case ===
  if (!label) {
    const sameMonthYear =
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    if (sameMonthYear) {
      return `${format(start, "MMM d")}–${format(end, "d, yyyy")}`;
    }

    return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
  }

  return label;
};

// utils/generateSalesInventoryData.ts
export function generateSalesAndInventoryTrend(startDate: Date, endDate: Date) {
  const data: { date: Date; sales: number; inventory: number }[] = [];

  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  let sales = 3000;
  let inventory = 2200;

  for (let i = 0; i <= totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Add slight daily fluctuation
    sales += Math.random() * 10 + 5; // gradual upward trend
    inventory += Math.random() * 8 + 2;

    data.push({
      date,
      sales: Math.round(sales),
      inventory: Math.round(inventory)
    });
  }

  return data;
}
