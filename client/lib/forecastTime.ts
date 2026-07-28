const TIMESTAMP_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

export interface LocalDateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/**
 * Forecast timestamps are offset-less strings already expressed in the
 * forecast location's local time. Parsing the digits directly (rather than
 * `new Date(timestamp)`) avoids the browser reinterpreting them in its own
 * timezone.
 */
export function parseLocalTimestamp(timestamp: string): LocalDateTimeParts {
  const match = TIMESTAMP_PATTERN.exec(timestamp);
  if (!match) {
    throw new Error(`Invalid forecast timestamp: ${timestamp}`);
  }
  const [, year, month, day, hour, minute] = match;
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };
}

function toUtcAnchor(parts: LocalDateTimeParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute));
}

/**
 * Derives a YYYY-MM-DD key from the location-local timestamp digits, so
 * grouping never depends on the viewer's browser timezone.
 */
export function getLocalDateKey(timestamp: string): string {
  const { year, month, day } = parseLocalTimestamp(timestamp);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  hour12: true,
  timeZone: "UTC",
});

export function formatLocalDate(timestamp: string): string {
  return dateFormatter.format(toUtcAnchor(parseLocalTimestamp(timestamp)));
}

export function formatLocalTime(timestamp: string): string {
  return timeFormatter.format(toUtcAnchor(parseLocalTimestamp(timestamp)));
}

export function formatDayRangeLabel(
  dayNumber: number,
  firstTimestamp: string,
  lastTimestamp: string,
): string {
  const date = formatLocalDate(firstTimestamp);
  const startTime = formatLocalTime(firstTimestamp);
  const endTime = formatLocalTime(lastTimestamp);

  return `Day ${dayNumber} \u00b7 ${date} \u00b7 ${startTime}\u2013${endTime}`;
}
