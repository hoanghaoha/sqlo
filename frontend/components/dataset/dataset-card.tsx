import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dataset } from "@/lib/types"
import { Badge } from "../ui/badge"

const DatasetCard = (dataset: Dataset) => {
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
          <Badge variant={"outline"}>{dataset.industry.toUpperCase()}</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DatasetCard
