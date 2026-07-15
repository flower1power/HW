export function getRuntimeString(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export function getRuntimeNumber(name: string, fallback: number): number {
  const rawValue = process.env[name]?.trim();
  if (!rawValue) {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive number, received: ${rawValue}`);
  }

  return value;
}
