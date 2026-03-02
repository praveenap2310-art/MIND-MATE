"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Circle, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed"
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export function TasksManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
  })

  // Load tasks from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`mindmate-tasks-${user.id}`)
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }
  }, [user])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (user && tasks.length >= 0) {
      localStorage.setItem(`mindmate-tasks-${user.id}`, JSON.stringify(tasks))
    }
  }, [tasks, user])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      })
      return
    }

    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...formData, updatedAt: new Date().toISOString() } : task,
        ),
      )
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks([newTask, ...tasks])
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    }

    setFormData({ title: "", description: "", priority: "medium", dueDate: "" })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast({
      title: "Success",
      description: "Task deleted successfully",
    })
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "pending" ? "completed" : "pending",
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  const openNewTaskDialog = () => {
    setEditingTask(null)
    setFormData({ title: "", description: "", priority: "medium", dueDate: "" })
    setIsDialogOpen(true)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Circle className="h-4 w-4 text-green-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tasks</h1>
          <p className="text-muted-foreground">
            Organize and track your to-dos ({completedTasks}/{totalTasks} completed)
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewTaskDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Update your task below." : "Add a new task to your list."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add task details (optional)"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingTask ? "Update Task" : "Create Task"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "No tasks found matching your criteria."
                : "No tasks yet. Create your first task!"}
            </div>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={openNewTaskDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:shadow-md transition-all ${task.status === "completed" ? "opacity-75" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <span className="capitalize">{task.priority}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(task)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
