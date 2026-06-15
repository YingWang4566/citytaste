import type { MetadataRoute } from "next"

export default function manifest() {
  return {
    name: "CityTaste",
    short_name: "CityTaste",
    description:
      "把零散收藏整理成可快速保存、按场景生成、自动规划路线的个人城市产品。",
    start_url: "/?city=shanghai",
    display: "standalone",
    background_color: "#f6efe6",
    theme_color: "#b96d2c",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    share_target: {
      action: "/quick-save",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  } as MetadataRoute.Manifest & {
    share_target: {
      action: string
      method: "GET" | "POST"
      params: {
        title?: string
        text?: string
        url?: string
      }
    }
  }
}
