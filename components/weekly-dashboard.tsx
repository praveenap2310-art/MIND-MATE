"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, BarChart3 } from "lucide-react"

interface MoodEntry {
  id: number
  date: string
  mood: string
  moodValue: string
  note: string
  label: string
}

export function WeeklyDashboard() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [weeklyStats, setWeeklyStats] = useState<Record<string, number>>({})

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    setMoodEntries(entries)

    // Calculate weekly stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weeklyEntries = entries.filter((entry: MoodEntry) => new Date(entry.date) >= weekAgo)

    const stats: Record<string, number> = {}
    weeklyEntries.forEach((entry: MoodEntry) => {
      stats[entry.moodValue] = (stats[entry.moodValue] || 0) + 1
    })

    setWeeklyStats(stats)
  }, [])

  const getLastSevenDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date)
    }
    return days
  }

  const getMoodForDate = (date: Date) => {
    const dateString = date.toDateString()
    return moodEntries.find((entry) => new Date(entry.date).toDateString() === dateString)
  }

  const getMostFrequentMood = () => {
    if (Object.keys(weeklyStats).length === 0) return null
    return Object.entries(weeklyStats).reduce((a, b) => (weeklyStats[a[0]] > weeklyStats[b[0]] ? a : b))[0]
  }

  const lastSevenDays = getLastSevenDays()
  const mostFrequentMood = getMostFrequentMood()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Your Weekly Mood Journey</h2>
        <p className="text-muted-foreground">Track your emotional patterns and celebrate your progress</p>
      </div>

      {/* Weekly Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Object.values(weeklyStats).reduce((a, b) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Frequent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostFrequentMood ? <span className="capitalize">{mostFrequentMood}</span> : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostFrequentMood ? `${weeklyStats[mostFrequentMood]} times` : "No data yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {lastSevenDays.filter((date) => getMoodForDate(date)).length}
            </div>
            <p className="text-xs text-muted-foreground">Days logged this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Mood Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {lastSevenDays.map((date, index) => {
              const moodEntry = getMoodForDate(date)
              const dayName = date.toLocaleDateString("en", { weekday: "short" })
              const dayNumber = date.getDate()

              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{dayName}</div>
                  <div className="text-xs text-muted-foreground mb-2">{dayNumber}</div>
                  <div className="h-16 flex items-center justify-center bg-card rounded-lg border">
                    {moodEntry ? (
                      <div className="text-center">
                        <div className="text-2xl mb-1">{moodEntry.mood}</div>
                        <Badge variant="secondary" className="text-xs">
                          {moodEntry.label}
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-xs">No entry</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodEntries
                .slice(-5)
                .reverse()
                .map((entry) => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                    <div className="text-2xl">{entry.mood}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{entry.label}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
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
