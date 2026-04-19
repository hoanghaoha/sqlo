import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api"
import { Dataset } from "@/lib/types"

export function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[] | null>(null)

  const load = useCallback(async () => {
    const data = await apiFetch<Dataset[]>("/datasets")
    setDatasets(data)
  }, [])

  useEffect(() => { load() }, [load])

  return { datasets, refresh: load }
}

export function useDataset(id: string) {
  const [dataset, setDataset] = useState<Dataset | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    const data = await apiFetch<Dataset>(`/datasets/${id}`)
    setDataset(data)
  }, [id])

  useEffect(() => { load() }, [load])

  return dataset
}
