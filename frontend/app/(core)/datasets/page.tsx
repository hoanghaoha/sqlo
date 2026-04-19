"use client"

import { useDatasets } from "@/hooks/datasets"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import DatasetCreateButton from "@/components/dataset/dataset-create-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const Page = () => {
  const { datasets, refresh } = useDatasets()

  return (
    <div className="flex flex-col p-4">
      <div>
        <DatasetCreateButton onCreated={refresh} />
      </div>
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {datasets?.map((dataset) => (
          <Link key={dataset.id} href={`/datasets/${dataset.id}`} className="flex flex-col">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full flex flex-col">
              <CardHeader>
                <CardTitle>{dataset.name}</CardTitle>
                <CardDescription>
                  <Badge>{dataset.industry}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {dataset.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div >
  )
}

export default Page
