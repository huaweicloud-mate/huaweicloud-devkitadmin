export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isNotEmpty(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== ''
}