import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dataset } from "@/lib/types"
import { Badge } from "../ui/badge"
import { DATASET_INDUSTRIES } from "@/lib/const"

const DatasetCard = (dataset: Dataset) => {
  const industry = DATASET_INDUSTRIES.find(i => i.value === dataset.industry)
  const IndustryIcon = industry?.icon

  return (
    <Link href={`/datasets/${dataset.id}`} className="flex flex-col justify-between">
      <Card className="hover:bg-accent transition-colors cursor-pointer h-full flex flex-col">
        <CardHeader>
          <CardTitle>{dataset.name}</CardTitle>
          <CardDescription>
            {dataset.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Badge variant={"outline"} className="gap-1">
            {IndustryIcon && <IndustryIcon className="size-3.5" />}
            {dataset.industry}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DatasetCard
