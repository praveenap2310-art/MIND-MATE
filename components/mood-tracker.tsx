"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Plus, TrendingUp, Calendar } from "lucide-react"

interface MoodEntry {
  id: string
  mood: number // 1-5 scale
  note: string
  date: string
  createdAt: string
}

const moodEmojis = ["😢", "😕", "😐", "😊", "😄"]
const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"]
const moodColors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", "text-blue-500"]

export function MoodTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number>(3)
  const [note, setNote] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Load mood entries from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedEntries = localStorage.getItem(`mindmate-moods-${user.id}`)
      if (savedEntries) {
        setMoodEntries(JSON.parse(savedEntries))
      }
    }
  }, [user])

  // Save mood entries to localStorage whenever entries change
  useEffect(() => {
    if (user && moodEntries.length >= 0) {
      localStorage.setItem(`mindmate-moods-${user.id}`, JSON.stringify(moodEntries))
    }
  }, [moodEntries, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if entry already exists for this date
    const existingEntry = moodEntries.find((entry) => entry.date === selectedDate)

    if (existingEntry) {
      // Update existing entry
      setMoodEntries(
        moodEntries.map((entry) =>
          entry.date === selectedDate
            ? { ...entry, mood: selectedMood, note, createdAt: new Date().toISOString() }
            : entry,
        ),
      )
      toast({
        title: "Success",
        description: "Mood entry updated successfully",
      })
    } else {
      // Create new entry
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        note,
        date: selectedDate,
        createdAt: new Date().toISOString(),
      }
      setMoodEntries([newEntry, ...moodEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      toast({
        title: "Success",
        description: "Mood entry added successfully",
      })
    }

    setNote("")
    setSelectedMood(3)
    setSelectedDate(new Date().toISOString().split("T")[0])
    setIsDialogOpen(false)
  }

  const openNewEntryDialog = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayEntry = moodEntries.find((entry) => entry.date === today)

    if (todayEntry) {
      setSelectedMood(todayEntry.mood)
      setNote(todayEntry.note)
      setSelectedDate(todayEntry.date)
    } else {
      setSelectedMood(3)
      setNote("")
      setSelectedDate(today)
    }

    setIsDialogOpen(true)
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0)
    return (sum / moodEntries.length).toFixed(1)
  }

  const getRecentTrend = () => {
    if (moodEntries.length < 2) return "neutral"
    const recent = moodEntries.slice(0, 7) // Last 7 entries
    const firstHalf = recent.slice(0, Math.ceil(recent.length / 2))
    const secondHalf = recent.slice(Math.ceil(recent.length / 2))

    const firstAvg = firstHalf.reduce((acc, entry) => acc + entry.mood, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((acc, entry) => acc + entry.mood, 0) / secondHalf.length

    if (firstAvg > secondAvg + 0.3) return "improving"
    if (secondAvg > firstAvg + 0.3) return "declining"
    return "stable"
  }

  const todayEntry = moodEntries.find((entry) => entry.date === new Date().toISOString().split("T")[0])
  const trend = getRecentTrend()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mood Tracker</h1>
          <p className="text-muted-foreground">Monitor your emotional well-being</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewEntryDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {todayEntry ? "Update Today" : "Log Today's Mood"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Log Your Mood</DialogTitle>
              <DialogDescription>
                How are you feeling today? Your mood tracking helps identify patterns over time.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-4">
                <Label>How are you feeling?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {moodEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedMood(index + 1)}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedMood === index + 1
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="text-xs text-center">{moodLabels[index]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Notes (optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind? Any specific reasons for this mood?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {moodEntries.find((entry) => entry.date === selectedDate) ? "Update Entry" : "Save Entry"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Mood</CardTitle>
          </CardHeader>
          <CardContent>
            {todayEntry ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl">{moodEmojis[todayEntry.mood - 1]}</span>
                <div>
                  <div className="text-2xl font-bold">{moodLabels[todayEntry.mood - 1]}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(todayEntry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No entry for today</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <div className="text-2xl font-bold">{getAverageMood()}/5</div>
                <div className="text-sm text-muted-foreground">Based on {moodEntries.length} entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendingUp
                className={`h-8 w-8 ${
                  trend === "improving" ? "text-green-500" : trend === "declining" ? "text-red-500" : "text-yellow-500"
                }`}
              />
              <div>
                <div className="text-2xl font-bold capitalize">{trend}</div>
                <div className="text-sm text-muted-foreground">Last 7 entries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {moodEntries.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              No mood entries yet. Start tracking your emotional well-being!
            </div>
            <Button onClick={openNewEntryDialog} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Mood
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Entries
            </CardTitle>
            <CardDescription>Your mood history over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{moodLabels[entry.mood - 1]}</span>
                      <span className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
