export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function shiftLocalDate(value: string, numberOfDays: number): string {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + numberOfDays);
  return formatLocalDate(date);
}

export function getStartOfWeek(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  const daysSinceMonday = (date.getDay() + 6) % 7;

  date.setDate(date.getDate() - daysSinceMonday);
  return date;
}

export function isValidDateValue(value: string | null): value is string {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return formatLocalDate(date) === value;
}
