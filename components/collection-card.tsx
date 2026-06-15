import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { getCollectionKindLabel, MOOD_CHIP_META } from "@/lib/planning"
import type { Collection } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CollectionCard({
  collection,
  count,
}: {
  collection: Collection
  count: number
}) {
  const moodLabels = (collection.moodTags ?? []).slice(0, 3)

  return (
    <Card className="editorial-card rounded-[1.75rem] border-none bg-card/85">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow">{getCollectionKindLabel(collection.kind)}</p>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {count} 站
          </Badge>
        </div>
        <CardTitle className="font-heading text-3xl">{collection.title}</CardTitle>
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {collection.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-[1.2rem] border border-border/70 bg-secondary/60 px-4 py-3 text-sm text-foreground/80">
          已整理 {count} 个地点
        </div>
        {moodLabels.length ? (
          <div className="flex flex-wrap gap-2">
            {moodLabels.map((mood) => (
              <Badge key={mood} variant="secondary" className="rounded-full bg-primary/8 text-primary">
                {MOOD_CHIP_META[mood].label}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={`/collections/${collection.slug}?city=${collection.city}`}
          className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
        >
          查看路线
          <ArrowUpRightIcon data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Card>
  )
}
