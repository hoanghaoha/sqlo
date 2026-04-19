"use client"

import { useState } from "react"
import { Dataset } from "@/lib/types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { apiFetch } from "@/lib/api"
import { IconTrash, IconDeviceFloppy } from "@tabler/icons-react"
import { Field, FieldGroup } from "../ui/field"

const DatasetSettings = ({ dataset, onUpdated, onDeleted }: {
  dataset: Dataset
  onUpdated?: (updated: Dataset) => void
  onDeleted?: () => void
}) => {
  const [name, setName] = useState(dataset.name)
  const [description, setDescription] = useState(dataset.description ?? "")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isDirty = name !== dataset.name || description !== (dataset.description ?? "")

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await apiFetch<Dataset>(`/datasets/${dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, description }),
      })
      onUpdated?.(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiFetch(`/datasets/${dataset.id}`, { method: "DELETE" })
      onDeleted?.()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <FieldGroup>
        <Field>
          <Label htmlFor="ds-name">Name</Label>
          <Input
            id="ds-name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="ds-description">Description</Label>
          <Textarea
            id="ds-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </Field>
        <Field>
          <Label>Industry</Label>
          <Input value={dataset.industry ?? "—"} disabled />
        </Field>
        <Field>
          <Label>Size</Label>
          <Input value={dataset.size ?? "—"} disabled />
        </Field>
        <Field>
          <Label>Row Count</Label>
          <Input value={dataset.row_count.toLocaleString()} disabled />
        </Field>
      </FieldGroup>

      <div className="flex items-center justify-between">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <IconTrash />
          {deleting ? "Deleting..." : "Delete Dataset"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          <IconDeviceFloppy />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

export default DatasetSettings
