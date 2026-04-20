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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { IconPlus, IconX, IconChevronDown } from "@tabler/icons-react"
import { Exercise } from "@/lib/types"
import { EXERCISE_LEVELS, EXERCISE_TOPIC_GROUPS, EXERCISE_MAX_TOPICS } from "@/lib/const"

const ALL_SUGGESTED = EXERCISE_TOPIC_GROUPS.flatMap(g => g.topics)


const DatasetExercisesCreateButton = ({ datasetId, onCreated }: {
  datasetId: string
  onCreated?: (exercise: Exercise) => void
}) => {
  const [open, setOpen] = useState(false)
  const [topicsOpen, setTopicsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("medium")
  const [topics, setTopics] = useState<string[]>([])
  const [additionalInput, setAdditionalInput] = useState("")
  const [loading, setLoading] = useState(false)

  const atLimit = topics.length >= EXERCISE_MAX_TOPICS

  const toggleTopic = (topic: string) => {
    setTopics(prev => {
      if (prev.includes(topic)) return prev.filter(t => t !== topic)
      if (prev.length >= EXERCISE_MAX_TOPICS) return prev
      return [...prev, topic]
    })
  }

  const removeTopic = (topic: string) => {
    setTopics(prev => prev.filter(t => t !== topic))
  }

  const addCustomTopic = () => {
    const value = search.trim()
    if (!value || topics.includes(value) || atLimit) return
    setTopics(prev => [...prev, value])
    setSearch("")
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
      setSearch("")
      setAdditionalInput("")
      setLevel("medium")
    } finally {
      setLoading(false)
    }
  }

  const customTopics = topics.filter(t => !ALL_SUGGESTED.includes(t))
  const trimmed = search.trim()
  const alreadyExists = [...ALL_SUGGESTED, ...customTopics].some(
    t => t.toLowerCase() === trimmed.toLowerCase()
  )
  const showCreate = trimmed.length > 0 && !alreadyExists && !atLimit

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-min">
        <Button size="sm">
          <IconPlus />
          Create Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Exercise</DialogTitle>
            <DialogDescription>
              SQLO AI will generate a SQL exercise for this dataset.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>
                Topics{" "}
                <span className="text-muted-foreground">
                  ({topics.length}/{EXERCISE_MAX_TOPICS})
                </span>
              </Label>
              <Popover open={topicsOpen} onOpenChange={setTopicsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={topicsOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span className="text-muted-foreground">
                      {topics.length > 0
                        ? `${topics.length} topic${topics.length > 1 ? "s" : ""} selected`
                        : "Select topics…"}
                    </span>
                    <IconChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={atLimit ? `Max ${EXERCISE_MAX_TOPICS} topics` : "Search or add topic…"}
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No topics found.</CommandEmpty>
                      {EXERCISE_TOPIC_GROUPS.map(group => (
                        <CommandGroup key={group.label} heading={group.label}>
                          {group.topics.map(topic => {
                            const selected = topics.includes(topic)
                            return (
                              <CommandItem
                                key={topic}
                                value={topic}
                                data-checked={selected}
                                disabled={!selected && atLimit}
                                onSelect={() => toggleTopic(topic)}
                              >
                                {topic}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      ))}
                      {customTopics.length > 0 && (
                        <CommandGroup heading="Custom">
                          {customTopics.map(topic => (
                            <CommandItem
                              key={topic}
                              value={topic}
                              data-checked
                              onSelect={() => toggleTopic(topic)}
                            >
                              {topic}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                      {showCreate && (
                        <CommandGroup>
                          <CommandItem
                            value={`__create_${trimmed}`}
                            onSelect={addCustomTopic}
                          >
                            Create &ldquo;{trimmed}&rdquo;
                          </CommandItem>
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {topics.map(topic => (
                    <Badge key={topic} variant="secondary" className="gap-1">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="hover:opacity-70"
                      >
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
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
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

export default DatasetExercisesCreateButton
