const DAY = 24 * 60 * 60 * 1000;

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const weekday = new Intl.DateTimeFormat("en", { weekday: "short" });
const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });

export function formatCompactNumber(value: number): string {
  return compactNumber.format(value);
}

/** 400000 → "400K", 1000000 → "1M". */
export function formatContextWindow(tokens: number): string {
  return compactNumber.format(tokens).replace(/\s/g, "");
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Coarse, stable label used in lists: "3:20 PM", "Yesterday", "Mon", "Sep 12". */
export function formatListDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / DAY);
  if (diffDays <= 0) return time.format(date);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return weekday.format(date);
  return shortDate.format(date);
}

export type DateGroup = "Today" | "Yesterday" | "Previous 7 days" | "Older";

export const DATE_GROUP_ORDER: DateGroup[] = ["Today", "Yesterday", "Previous 7 days", "Older"];

export function getDateGroup(iso: string, now: Date = new Date()): DateGroup {
  const diffDays = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "Previous 7 days";
  return "Older";
}

/** Groups items by recency while keeping the order defined in DATE_GROUP_ORDER. */
export function groupByDate<T>(items: T[], getDate: (item: T) => string, now: Date = new Date()) {
  const groups = new Map<DateGroup, T[]>();
  for (const item of items) {
    const group = getDateGroup(getDate(item), now);
    const list = groups.get(group) ?? [];
    list.push(item);
    groups.set(group, list);
  }
  return DATE_GROUP_ORDER.filter((group) => groups.has(group)).map((group) => ({
    group,
    items: groups.get(group)!,
  }));
}
