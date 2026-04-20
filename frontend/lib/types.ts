export interface SchemaColumn {
  name: string
  type: string
  nullable: boolean
  primary_key?: boolean
  unique?: boolean
  generator?: { method: string; references?: string }
}

export interface SchemaTable {
  name: string
  row_count: number
  columns: SchemaColumn[]
}

export interface DatasetSchema {
  tables: SchemaTable[]
}

export interface UserProfile {
  id: string
  plan: string
  industry?: string
  level?: string
  purpose?: string
}

export interface Dataset {
  id: string
  user_id: string
  name: string
  description: string
  industry: string
  size: number
  row_count: number
  schema: DatasetSchema
  db_path: string
  created_at: string
}

export interface Exercise {
  id: string
  dataset_id: string
  user_id: string
  name: string
  description: string
  topics: string[]
  level: string
  solution: string
}

