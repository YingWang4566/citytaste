import { OWNER_COOKIE, OWNER_PASSWORD } from "@/lib/constants"

export { OWNER_COOKIE, OWNER_PASSWORD }

export function isOwnerValue(value?: string) {
  return value === "1"
}
