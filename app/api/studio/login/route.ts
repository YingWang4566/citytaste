import { NextResponse } from "next/server"
import { OWNER_COOKIE, OWNER_PASSWORD } from "@/lib/auth"

export async function POST(request: Request) {
  const formData = await request.formData()
  const password = formData.get("password")
  const from = (formData.get("from") as string) || "/studio/import"
  const city = (formData.get("city") as string) || "shanghai"
  const baseUrl = new URL(request.url)

  if (password !== OWNER_PASSWORD) {
    const errorUrl = new URL("/studio/login", baseUrl)
    errorUrl.searchParams.set("error", "1")
    errorUrl.searchParams.set("from", from)
    errorUrl.searchParams.set("city", city)
    return NextResponse.redirect(errorUrl)
  }

  const response = NextResponse.redirect(new URL(from, baseUrl))
  response.cookies.set(OWNER_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })
  return response
}
