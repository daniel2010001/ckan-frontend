/* eslint-disable @typescript-eslint/no-explicit-any */
export function isNumeric(value: any): boolean {
  if (typeof value === "number") return true;
  if (typeof value !== "string") return false;

  // Reemplazar comas por puntos para manejar números con formato europeo
  const normalizedValue = value.replace(",", ".");
  return !isNaN(parseFloat(normalizedValue)) && isFinite(Number(normalizedValue));
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(",", "."));
}

export function isValidDate(value: any): boolean {
  return !isNaN(Date.parse(value));
}

export function isValidTime(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function canBeNumber(values: any[]): boolean {
  return values.every(isNumeric);
}

export function canBeDate(values: any[]): boolean {
  return values.every(isValidDate);
}

export function canBeTime(values: any[]): boolean {
  return values.every(isValidTime);
}

export function canBeEmail(values: any[]): boolean {
  return values.every(isValidEmail);
}

export function getDataType(values: any[]): "numeric" | "date" | "time" | "email" | "other" {
  if (canBeNumber(values)) return "numeric";
  if (canBeDate(values)) return "date";
  if (canBeTime(values)) return "time";
  if (canBeEmail(values)) return "email";
  return "other";
}

export function getEmailDomain(email: string): string {
  return email.split("@")[1];
}

export function convertToSystemTimeZone(dateString: string): Date {
  const date = new Date(dateString);
  const offsetMinutes = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() + offsetMinutes * 60 * 1000);
  // const adjustedDate = new Date(localDate.getTime() + 14400000);
  return localDate;
}
