import { Suspense } from "react"
import type { Metadata } from "next"
import "leaflet/dist/leaflet.css"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import { VisitStateProvider } from "@/components/visit-state-provider"

export const metadata: Metadata = {
  title: "CityTaste",
  description:
    "CityTaste 是一个面向个人生活方式规划的城市产品，把零散收藏整理成可快速保存、按场景生成、回到地图继续使用的路线系统。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <VisitStateProvider>
          <div className="texture-paper flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <Suspense
              fallback={
                <footer className="border-t border-border/70 bg-card/50">
                  <div className="page-shell py-10" />
                </footer>
              }
            >
              <SiteFooter />
            </Suspense>
          </div>
          <Toaster richColors />
        </VisitStateProvider>
      </body>
    </html>
  )
}
