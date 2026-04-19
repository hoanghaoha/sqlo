"use client"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { useDatasets } from "@/hooks/datasets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowRight, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import Link from "next/link"

const Page = () => {
  const { datasets, refresh } = useDatasets()
  const [result, setResult] = useState("")

  const handleCreateDataset = (async () => {
    const data = await apiFetch("/datasets/", { method: "POST", body: JSON.stringify({ name: "E-commerce", industry: "e-commerce", description: "Online marketplace with sellers, products, orders and reviews. Focus on sales analytics and customer behavior", size: "small" }) })
    setResult(JSON.stringify(data))

  })

  return (
    <div className="flex flex-col p-4">
      <div>
        <Button onClick={handleCreateDataset}>
          Create Dataset
        </Button>
      </div>
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {datasets?.map((dataset) => (
          <Card key={dataset.id}>
            <CardHeader>
              <CardTitle>{dataset.name}</CardTitle>
              <CardDescription>{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Button size={"sm"}>
                <Link href={`/datasets/${dataset.id}`}>
                  View
                </Link>
                <IconArrowRight />
              </Button>
              <Button size={"icon"} variant={"destructive"} onClick={async () => {
                await apiFetch(`/datasets/${dataset.id}`, { method: "DELETE" })
                refresh()
              }}>
                <IconTrash />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>{result}</div>
    </div >
  )
}

export default Page
