import { LockKeyholeIcon } from "lucide-react"
import { OWNER_PASSWORD } from "@/lib/auth"
import { normalizeCitySlug } from "@/lib/place-utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string; city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)
  const showDemoPassword = OWNER_PASSWORD === "citytaste-owner"
  const defaultFrom = `/studio/import?city=${selectedCity}`

  return (
    <div className="page-shell py-10">
      <section className="mx-auto max-w-2xl editorial-card rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="eyebrow">维护者登录</p>
        <h1 className="mt-4 font-heading text-5xl">登录 CityTaste 工作台</h1>
        <p className="mt-4 text-base leading-8 text-foreground/78">
          工作台页面默认只对维护者开放。这个演示版本用 cookie 做轻量鉴权，后续可以无缝替换成 Supabase Auth。
        </p>

        <form action="/api/studio/login" method="post" className="mt-8">
          <input type="hidden" name="from" value={params.from ?? defaultFrom} />
          <input type="hidden" name="city" value={selectedCity} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">维护者密码</FieldLabel>
              <Input id="password" name="password" type="password" required />
              {showDemoPassword ? (
                <FieldDescription>
                  演示密码：<code>{OWNER_PASSWORD}</code>
                </FieldDescription>
              ) : null}
            </Field>
          </FieldGroup>

          {params.error ? (
            <p className="mt-4 rounded-[1rem] border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              密码不正确，请重试。
            </p>
          ) : null}

          <div className="mt-6">
            <Button type="submit" className="rounded-full">
              <LockKeyholeIcon data-icon="inline-start" />
              进入工作台
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
