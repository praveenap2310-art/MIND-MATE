"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const MOODS = [
  { emoji: "😊", label: "Happy", value: "happy", description: "Feeling joyful and content" },
  { emoji: "😢", label: "Sad", value: "sad", description: "Feeling down or melancholy" },
  { emoji: "😠", label: "Angry", value: "angry", description: "Feeling frustrated or irritated" },
  { emoji: "😰", label: "Anxious", value: "anxious", description: "Feeling worried or stressed" },
  { emoji: "😴", label: "Tired", value: "tired", description: "Feeling exhausted or low energy" },
  { emoji: "🤗", label: "Excited", value: "excited", description: "Feeling energetic and enthusiastic" },
  { emoji: "😌", label: "Calm", value: "calm", description: "Feeling peaceful and relaxed" },
  { emoji: "🤔", label: "Thoughtful", value: "thoughtful", description: "Feeling reflective or contemplative" },
]

interface MoodLoggerProps {
  onMoodLogged: (mood: string) => void
}

export function MoodLogger({ onMoodLogged }: MoodLoggerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [selectedMoodData, setSelectedMoodData] = useState<(typeof MOODS)[0] | null>(null)
  const { toast } = useToast()

  const handleMoodSelect = (mood: (typeof MOODS)[0]) => {
    setSelectedMood(mood.value)
    setSelectedMoodData(mood)
  }

  const handleSaveMood = () => {
    if (!selectedMood || !selectedMoodData) return

    const moodEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMoodData.emoji,
      moodValue: selectedMood,
      note: note.trim(),
      label: selectedMoodData.label,
    }

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]")

    // Check if already logged today
    const today = new Date().toDateString()
    const todayEntryIndex = existingEntries.findIndex((entry: any) => new Date(entry.date).toDateString() === today)

    if (todayEntryIndex >= 0) {
      existingEntries[todayEntryIndex] = moodEntry
    } else {
      existingEntries.push(moodEntry)
    }

    localStorage.setItem("moodEntries", JSON.stringify(existingEntries))

    onMoodLogged(selectedMoodData.emoji)

    toast({
      title: "Mood logged successfully!",
      description: `You're feeling ${selectedMoodData.label.toLowerCase()} today.`,
    })

    // Reset form
    setSelectedMood(null)
    setSelectedMoodData(null)
    setNote("")
  }

  return (
    <div className="space-y-6">
      {/* Mood Selection Grid */}
      <div className="grid grid-cols-4 gap-3">
        {MOODS.map((mood) => (
          <Card
            key={mood.value}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedMood === mood.value ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"
            }`}
            onClick={() => handleMoodSelect(mood)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Mood Description */}
      {selectedMoodData && (
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedMoodData.emoji}</span>
              <div>
                <h3 className="font-semibold text-accent-foreground">{selectedMoodData.label}</h3>
                <p className="text-sm text-muted-foreground">{selectedMoodData.description}</p>
              </div>
            </div>

            <Textarea
              placeholder="Add a note about your mood (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-4"
              rows={3}
            />

            <Button onClick={handleSaveMood} className="w-full">
              Log My Mood
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
