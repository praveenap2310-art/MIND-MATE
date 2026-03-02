"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { NotesManager } from "@/components/notes-manager"
import { TasksManager } from "@/components/tasks-manager"
import { MoodTracker } from "@/components/mood-tracker"
import { FileText, CheckSquare, Heart, LogOut, Home } from "lucide-react"

type ActiveView = "dashboard" | "notes" | "tasks" | "mood"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  const handleLogout = () => {
    logout()
  }

  if (activeView !== "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 to-background">
        <header className="bg-card border-b border-border p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("dashboard")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <h1 className="text-xl font-semibold capitalize">{activeView}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          {activeView === "notes" && <NotesManager />}
          {activeView === "tasks" && <TasksManager />}
          {activeView === "mood" && <MoodTracker />}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">MindMate</h1>
            <p className="text-sm text-muted-foreground">Personal Productivity & Wellness</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance mb-2">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
            {user?.name}!
          </h2>
          <p className="text-muted-foreground text-pretty">
            Ready to boost your productivity and track your wellness journey?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => setActiveView("notes")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Notes</CardTitle>
              <CardDescription>Capture your thoughts, ideas, and important information</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full bg-transparent">
                Manage Notes
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => setActiveView("tasks")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Tasks</CardTitle>
              <CardDescription>Organize your to-dos and track your progress</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full bg-transparent">
                Manage Tasks
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => setActiveView("mood")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Mood Tracker</CardTitle>
              <CardDescription>Monitor your emotional well-being and identify patterns</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full bg-transparent">
                Track Mood
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
