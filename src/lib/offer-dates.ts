export interface DateParts {
  dd: string;
  mm: string;
  yyyy: string;
}

export const EMPTY_DATE_PARTS: DateParts = { dd: "", mm: "", yyyy: "" };

/** Start of today in local time */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseOfferDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const dd = Number(match[1]);
  const mm = Number(match[2]);
  const yyyy = Number(match[3]);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const date = new Date(yyyy, mm - 1, dd);
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

export function partsToDate(parts: DateParts): Date | null {
  if (!isCompleteDateParts(parts)) return null;
  return parseOfferDate(formatDateParts(parts));
}

export function formatDateParts(parts: DateParts) {
  const dd = parts.dd.padStart(2, "0");
  const mm = parts.mm.padStart(2, "0");
  return `${dd}/${mm}/${parts.yyyy}`;
}

export function isCompleteDateParts(parts: DateParts) {
  return (
    parts.dd.length >= 1 &&
    parts.mm.length >= 1 &&
    parts.yyyy.length === 4 &&
    Number(parts.dd) >= 1 &&
    Number(parts.dd) <= 31 &&
    Number(parts.mm) >= 1 &&
    Number(parts.mm) <= 12
  );
}

/** True when calendar day is before today */
export function isPastDate(date: Date) {
  return date.getTime() < startOfToday().getTime();
}

/** Offer expired when end date is before today */
export function isOfferExpired(validityTo: string) {
  const end = parseOfferDate(validityTo);
  if (!end) return false;
  return isPastDate(end);
}

export type OfferDateValidation =
  | { ok: true }
  | { ok: false; message: string };

export function validateOfferDateRange(
  start: DateParts,
  end: DateParts
): OfferDateValidation {
  if (!isCompleteDateParts(start) || !isCompleteDateParts(end)) {
    return { ok: false, message: "Enter a complete start and end date." };
  }

  const startDate = partsToDate(start);
  const endDate = partsToDate(end);

  if (!startDate || !endDate) {
    return { ok: false, message: "Enter a valid calendar date." };
  }

  if (isPastDate(startDate)) {
    return {
      ok: false,
      message: "Start date cannot be in the past. Choose today or a future date.",
    };
  }

  if (isPastDate(endDate)) {
    return {
      ok: false,
      message: "End date cannot be in the past. Choose today or a future date.",
    };
  }

  if (endDate.getTime() < startDate.getTime()) {
    return {
      ok: false,
      message: "End date must be on or after the start date.",
    };
  }

  return { ok: true };
}
