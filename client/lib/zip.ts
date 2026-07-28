const ZIP_PATTERN = /^(\d{5})(?:-\d{4})?$/;

export function normalizeZip(input: string): string | null {
  const match = ZIP_PATTERN.exec(input.trim());
  return match ? match[1] : null;
}
