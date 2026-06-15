import { cookies } from "next/headers"
import { OWNER_COOKIE } from "@/lib/auth"
import { SiteHeaderClient } from "@/components/site-header-client"

export async function SiteHeader() {
  const cookieStore = await cookies()
  const isOwner = cookieStore.get(OWNER_COOKIE)?.value === "1"

  return <SiteHeaderClient isOwner={isOwner} />
}
