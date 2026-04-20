"use client"

import { useDatasets } from "@/hooks/datasets"
import DatasetCreateButton from "@/components/dataset/dataset-create-button"
import DatasetCard from "@/components/dataset/dataset-card"

const Page = () => {
  const { datasets, refresh } = useDatasets()

  return (
    <div className="flex flex-col p-4">
      <div>
        <DatasetCreateButton onCreated={refresh} />
      </div>
      <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {datasets?.map((dataset) => (
          <DatasetCard key={dataset.id} {...dataset} />
        ))}
      </div>
    </div >
  )
}

export default Page
