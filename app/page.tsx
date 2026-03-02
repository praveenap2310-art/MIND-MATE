"use client"

import { useState, useEffect } from "react"
import { MoodLogger } from "@/components/mood-logger"
import { WeeklyDashboard } from "@/components/weekly-dashboard"
import { MediaRecommendations } from "@/components/media-recommendations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Film } from "lucide-react"

type View = "log" | "dashboard" | "recommendations"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("log")
  const [todaysMood, setTodaysMood] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has logged mood today
    const today = new Date().toDateString()
    const moods = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const todayEntry = moods.find((entry: any) => new Date(entry.date).toDateString() === today)
    if (todayEntry) {
      setTodaysMood(todayEntry.mood)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">MindMate</h1>
              <p className="text-sm text-muted-foreground">Track emotions, discover media</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentView === "log" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("log")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Log Mood
              </Button>
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trends
              </Button>
              <Button
                variant={currentView === "recommendations" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("recommendations")}
              >
                <Film className="w-4 h-4 mr-2" />
                Media
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "log" && (
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">How are you feeling today?</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodLogger onMoodLogged={(mood) => setTodaysMood(mood)} />
              </CardContent>
            </Card>

            {todaysMood && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Today's mood logged:</p>
                    <div className="text-4xl mb-2">{todaysMood}</div>
                    <p className="text-sm text-muted-foreground">
                      Great job tracking your emotions! Check out your trends or discover new media.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentView === "dashboard" && <WeeklyDashboard />}

        {currentView === "recommendations" && <MediaRecommendations />}
      </main>
    </div>
  )
}
