"use client"

import { useDatasets } from "@/hooks/datasets"
import DatasetCreateButton from "@/components/dataset/dataset-create-button"
import DatasetCard from "@/components/dataset/dataset-card"

const Page = () => {
  const { datasets, refresh } = useDatasets()

  return (
    <div className="flex flex-col gap-6 pt-12 w-[60%] mx-auto">
      <div className="flex items-center justify-between w-full">
        <p className="text-xl font-semibold">Datasets</p>
        <DatasetCreateButton onCreated={refresh} />
      </div>
      <div className="grid gap-4 mt-4 w-full" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {datasets?.map((dataset) => (
          <DatasetCard key={dataset.id} {...dataset} />
        ))}
      </div>
    </div >
  )
}

export default Page
