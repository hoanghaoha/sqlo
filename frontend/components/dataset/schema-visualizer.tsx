"use client"

import { useDataset } from "@/hooks/datasets"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react"
import { useEffect, useMemo } from "react"
import { Dataset, DatasetSchema, SchemaColumn } from "@/lib/types"

type TableNodeData = {
  name: string
  row_count: number
  columns: SchemaColumn[]
  referencedCols: Set<string>
}

function TableNode({ data }: NodeProps<Node<TableNodeData>>) {
  return (
    <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm min-w-55">
      <div className="px-3 py-2 border-b border-border bg-muted rounded-t-md">
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-muted-foreground">{data.row_count} rows</div>
      </div>
      <div className="text-xs">
        {data.columns.map((col) => {
          const isFK = col.generator?.method === "foreign_key"
          const isReferenced = data.referencedCols.has(col.name)
          const tag = col.primary_key ? "PK" : isFK ? "FK" : ""
          return (
            <div
              key={col.name}
              className="relative flex justify-between gap-3 px-3 py-1.5 border-b border-border last:border-0"
            >
              {isReferenced && (
                <Handle
                  id={`${col.name}-target`}
                  type="target"
                  position={Position.Left}
                  className="bg-primary! w-2! h-2!"
                />
              )}
              <span className="font-medium">
                {col.name}
                {tag && <span className="ml-1 text-[10px] text-primary font-bold">{tag}</span>}
              </span>
              <span className="text-muted-foreground">{col.type}</span>
              {isFK && (
                <Handle
                  id={`${col.name}-source`}
                  type="source"
                  position={Position.Right}
                  className="bg-primary! w-2! h-2!"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const nodeTypes = { table: TableNode }

function buildGraph(schema: DatasetSchema): { nodes: Node<TableNodeData>[]; edges: Edge[] } {
  const cols = 3
  const colWidth = 320
  const rowHeight = 360

  const referenced: Record<string, Set<string>> = {}
  const edges: Edge[] = []
  for (const t of schema.tables) {
    for (const col of t.columns) {
      if (col.generator?.method === "foreign_key" && col.generator.references) {
        const [refTable, refCol] = col.generator.references.split(".")
          ; (referenced[refTable] ??= new Set()).add(refCol)
        edges.push({
          id: `${t.name}.${col.name}->${refTable}.${refCol}`,
          source: t.name,
          sourceHandle: `${col.name}-source`,
          target: refTable,
          targetHandle: `${refCol}-target`,
        })
      }
    }
  }

  const nodes: Node<TableNodeData>[] = schema.tables.map((t, i) => ({
    id: t.name,
    type: "table",
    position: { x: (i % cols) * colWidth, y: Math.floor(i / cols) * rowHeight },
    data: {
      name: t.name,
      row_count: t.row_count,
      columns: t.columns,
      referencedCols: referenced[t.name] ?? new Set(),
    },
  }))

  return { nodes, edges }
}

function Flow({ schema }: { schema: DatasetSchema }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(schema), [schema])
  const [nodes, , onNodesChange] = useNodesState(initNodes)
  const [edges, , onEdgesChange] = useEdgesState(initEdges)

  useEffect(() => {
    const id = "rf-css"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css"
    document.head.appendChild(link)
  }, [])

  return (
    <div className="w-full h-full min-h-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  )
}

export default function SchemaVisualizer(dataset: Dataset) {
  return (
    <ReactFlowProvider>
      <Flow schema={dataset.schema as DatasetSchema} />
    </ReactFlowProvider>

  )
}
