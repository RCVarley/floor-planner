export function round(val: number, places = 0) {
  if (!places) {
    return Math.round(val)
  }

  const preserve = 10 ** places

  return Math.round(val * preserve) / preserve
}