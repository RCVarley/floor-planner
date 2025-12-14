export function resetReactiveArray(array: any[]) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    array.pop()
  }
}