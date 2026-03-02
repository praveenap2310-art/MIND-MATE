"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function NotesManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "" })

  // Load notes from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotes = localStorage.getItem(`mindmate-notes-${user.id}`)
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    }
  }, [user])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (user && notes.length >= 0) {
      localStorage.setItem(`mindmate-notes-${user.id}`, JSON.stringify(notes))
    }
  }, [notes, user])

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    if (editingNote) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...note, ...formData, updatedAt: new Date().toISOString() } : note,
        ),
      )
      toast({
        title: "Success",
        description: "Note updated successfully",
      })
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
      toast({
        title: "Success",
        description: "Note created successfully",
      })
    }

    setFormData({ title: "", content: "" })
    setEditingNote(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({ title: note.title, content: note.content })
    setIsDialogOpen(true)
  }

  const handleDelete = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    toast({
      title: "Success",
      description: "Note deleted successfully",
    })
  }

  const openNewNoteDialog = () => {
    setEditingNote(null)
    setFormData({ title: "", content: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notes</h1>
          <p className="text-muted-foreground">Capture and organize your thoughts</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewNoteDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
              <DialogDescription>
                {editingNote ? "Update your note below." : "Add a new note to your collection."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your note content here..."
                  rows={6}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingNote ? "Update Note" : "Create Note"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {searchTerm ? "No notes found matching your search." : "No notes yet. Create your first note!"}
            </div>
            {!searchTerm && (
              <Button onClick={openNewNoteDialog} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(note)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {new Date(note.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(note.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
