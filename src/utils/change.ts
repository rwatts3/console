export function keysChanged(a: any, b: any, keys: string[]) {
  let changed = false
  keys.forEach(key => {
    if (a[key] !== b[key]) {
      changed = true
    }
  })
  return changed
}
