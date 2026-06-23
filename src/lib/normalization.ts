export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeAuthCode(value: string): string {
  return value.normalize("NFKC").trim();
}
