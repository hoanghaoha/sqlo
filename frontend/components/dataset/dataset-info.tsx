import { Dataset } from "@/lib/types"

const DatasetInfo = (dataset: Dataset) => {
  return (
    <div>
      <p>Name: {dataset.name}</p>
      <p>Industry: {dataset.industry}</p>
      <p>Description: {dataset.description}</p>
      <p>Size: {dataset.size}</p>
      <p>Row count: {dataset.row_count}</p>
    </div>
  )
}

export default DatasetInfo
