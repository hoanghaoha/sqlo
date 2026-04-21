"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldDescription, FieldGroup } from "../ui/field"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { IconPlus } from "@tabler/icons-react"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DATASET_INDUSTRIES, DATASET_SIZES } from "@/lib/const"

const DatasetCreateButton = ({ onCreated }: { onCreated?: () => void }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [description, setDescription] = useState("")
  const [size, setSize] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateDataset = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch("/datasets/", {
        method: "POST",
        body: JSON.stringify({ name, industry, description, size }),
      })
      setOpen(false)
      setName("")
      setIndustry("")
      setDescription("")
      setSize("")
    } finally {
      setLoading(false)
      onCreated?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <IconPlus />
          Create Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <form onSubmit={handleCreateDataset} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Dataset</DialogTitle>
            <DialogDescription>
              Please describe your dataset.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="overflow-y-auto max-h-[60vh]">
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
            </Field>
            <Field>
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DATASET_INDUSTRIES.map(i => (
                      <SelectItem key={i.value} value={i.value}>
                        <span className="flex items-center gap-2">
                          <i.icon className="h-4 w-4" />
                          {i.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {industry === "other" && (
                <FieldDescription>Please describe your industry in the Description field.</FieldDescription>
              )}
            </Field>
            <Field>
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={setSize} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Dataset Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DATASET_SIZES.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="flex items-center gap-2">
                          <s.icon className="h-4 w-4" />
                          {s.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the dataset you want to generate..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DatasetCreateButton
