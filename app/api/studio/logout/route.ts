import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"

export async function POST(request: Request) {
  const formData = await request.formData()
  const redirectTo = (formData.get("redirectTo") as string) || "/"
  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  response.cookies.set(OWNER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
  return response
}
