// Simple RFC4122 v4-ish ID generator
export function uid<ReturnType extends string = string>(prefix = ""): ReturnType {
  const s = crypto.getRandomValues(new Uint8Array(16))
  // Variant 4 UUID formatting
  s[6] = (s[6]! & 0x0f) | 0x40
  s[8] = (s[8]! & 0x3f) | 0x80
  const hex = [...s].map(b => b.toString(16).padStart(2, "0")).join("")
  const id = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
  return (prefix ? `${prefix}_${id}` : id) as ReturnType
}

export function brandedId<ReturnType extends string = string>(id: string): ReturnType {
  return id as ReturnType
}