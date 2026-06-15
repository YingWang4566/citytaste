import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/studio")) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === "/studio/login") {
    return NextResponse.next()
  }

  const isOwner = request.cookies.get(OWNER_COOKIE)?.value === "1"

  if (isOwner) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/studio/login", request.url)
  loginUrl.searchParams.set("from", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/studio/:path*"],
}
