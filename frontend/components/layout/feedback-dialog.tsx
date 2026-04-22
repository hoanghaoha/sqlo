"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TYPES = [
  { value: "bug", label: "Bug report" },
  { value: "suggestion", label: "Suggestion" },
  { value: "general", label: "General feedback" },
]

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [type, setType] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setType("")
    setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch("/feedback/", {
        method: "POST",
        body: JSON.stringify({ type, message }),
      })
      onOpenChange(false)
      reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogDescription>
              Found a bug or have a suggestion? We read everything.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Type</Label>
              <Select value={type || undefined} onValueChange={setType} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What kind of feedback?" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Message</Label>
              <Textarea
                placeholder="Describe the issue or idea..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!type || !message || loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
