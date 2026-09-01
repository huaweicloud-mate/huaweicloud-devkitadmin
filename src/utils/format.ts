export function formatDate(date: Date | string, format = 'YYYY-MM-DD'): string {
  const d = new Date(date)
  const map: Record<string, number> = {
    'YYYY': d.getFullYear(),
    'MM': d.getMonth() + 1,
    'DD': d.getDate(),
    'HH': d.getHours(),
    'mm': d.getMinutes(),
    'ss': d.getSeconds(),
  }
  let result = format
  for (const [key, value] of Object.entries(map)) {
    result = result.replace(key, String(value).padStart(2, '0'))
  }
  return result
}

export function formatMoney(amount: number, currency = '¥'): string {
  return `${currency}${amount.toFixed(2)}`
}