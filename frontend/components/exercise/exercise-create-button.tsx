"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { IconPlus, IconX, IconChevronDown } from "@tabler/icons-react"
import { Exercise, Dataset } from "@/lib/types"
import { EXERCISE_LEVELS, EXERCISE_TOPIC_GROUPS, EXERCISE_MAX_TOPICS } from "@/lib/const"
import { useDatasets } from "@/hooks/datasets"

const ExerciseCreateButton = ({ dataset, onCreated }: {
  dataset?: Dataset
  onCreated?: (exercise: Exercise) => void
}) => {
  const { datasets } = useDatasets()
  const [datasetId, setDatasetId] = useState(dataset?.id)
  const [open, setOpen] = useState(false)
  const [level, setLevel] = useState("medium")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [additionalInput, setAdditionalInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [groupsOpen, setGroupsOpen] = useState(false)
  const [topicsOpen, setTopicsOpen] = useState(false)

  const GROUP_LIMIT = 3
  const groupsAtLimit = selectedGroups.length >= GROUP_LIMIT
  const atLimit = topics.length >= EXERCISE_MAX_TOPICS

  const filteredTopics = selectedGroups.length > 0
    ? EXERCISE_TOPIC_GROUPS.filter(g => selectedGroups.includes(g.label)).flatMap(g => g.topics)
    : []

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => {
      if (prev.includes(group)) {
        const next = prev.filter(g => g !== group)
        setTopics(t => t.filter(topic =>
          EXERCISE_TOPIC_GROUPS.filter(g => next.includes(g.label)).flatMap(g => g.topics).includes(topic)
        ))
        return next
      }
      if (prev.length >= GROUP_LIMIT) return prev
      return [...prev, group]
    })
  }

  const toggleTopic = (topic: string) => {
    setTopics(prev => {
      if (prev.includes(topic)) return prev.filter(t => t !== topic)
      if (prev.length >= EXERCISE_MAX_TOPICS) return prev
      return [...prev, topic]
    })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const exercise = await apiFetch<Exercise>("/exercises/", {
        method: "POST",
        body: JSON.stringify({
          dataset_id: datasetId,
          topics,
          level,
          additional_input: additionalInput || null,
        }),
      })
      onCreated?.(exercise)
      setOpen(false)
      setTopics([])
      setSelectedGroups([])
      setAdditionalInput("")
      setLevel("medium")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-min">
        <Button size="sm">
          <IconPlus />
          Create Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Exercise</DialogTitle>
            <DialogDescription>
              SQLO AI will generate a SQL exercise for this dataset.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="overflow-y-auto max-h-[60vh]">
            {!dataset &&
              <Field>
                <Label>Dataset</Label>
                <Select value={datasetId ?? datasets?.[0]?.id} onValueChange={setDatasetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {datasets?.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            }

            {/* Step 1: Select groups */}
            <Field>
              <Label>
                Category{" "}
                <span className="text-muted-foreground">({selectedGroups.length}/{GROUP_LIMIT})</span>
              </Label>
              <button
                type="button"
                onClick={() => setGroupsOpen(o => !o)}
                className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <span className={selectedGroups.length === 0 ? "text-muted-foreground" : ""}>
                  {selectedGroups.length > 0 ? selectedGroups.join(", ") : "Select categories…"}
                </span>
                <IconChevronDown className={`size-4 shrink-0 ml-2 opacity-50 transition-transform ${groupsOpen ? "rotate-180" : ""}`} />
              </button>
              {groupsOpen && (
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-md">
                  {EXERCISE_TOPIC_GROUPS.map(group => {
                    const selected = selectedGroups.includes(group.label)
                    return (
                      <button
                        key={group.label}
                        type="button"
                        disabled={!selected && groupsAtLimit}
                        onClick={() => toggleGroup(group.label)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors disabled:opacity-30
                          ${selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary hover:text-primary"
                          }`}
                      >
                        {group.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </Field>

            {/* Step 2: Select topics filtered by group */}
            <Field>
              <Label>
                Topics{" "}
                <span className="text-muted-foreground">({topics.length}/{EXERCISE_MAX_TOPICS})</span>
              </Label>
              <button
                type="button"
                disabled={selectedGroups.length === 0}
                onClick={() => setTopicsOpen(o => !o)}
                className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={topics.length === 0 ? "text-muted-foreground" : ""}>
                  {selectedGroups.length === 0
                    ? "Select a category first…"
                    : topics.length > 0 ? topics.join(", ") : "Select topics…"}
                </span>
                <IconChevronDown className={`size-4 shrink-0 ml-2 opacity-50 transition-transform ${topicsOpen ? "rotate-180" : ""}`} />
              </button>
              {topicsOpen && filteredTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-md">
                  {filteredTopics.map(topic => {
                    const selected = topics.includes(topic)
                    return (
                      <button
                        key={topic}
                        type="button"
                        disabled={!selected && atLimit}
                        onClick={() => toggleTopic(topic)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-colors disabled:opacity-30
                          ${selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary hover:text-primary"
                          }`}
                      >
                        {topic}
                      </button>
                    )
                  })}
                </div>
              )}
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {topics.map(topic => (
                    <Badge key={topic} variant="secondary" className="gap-1">
                      {topic}
                      <button type="button" onClick={() => toggleTopic(topic)} className="hover:opacity-70">
                        <IconX className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>

            <Field>
              <Label>Difficulty</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {EXERCISE_LEVELS.map(l => (
                      <SelectItem key={l.value} value={l.value}>
                        <span className="flex items-center gap-2">
                          <l.icon className={`size-4 ${l.color}`} />
                          {l.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>
                Additional Instructions{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                placeholder="e.g. Focus on sales data from Q4, avoid window functions…"
                value={additionalInput}
                onChange={e => setAdditionalInput(e.target.value)}
                rows={2}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || topics.length === 0}>
              {loading ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExerciseCreateButton
