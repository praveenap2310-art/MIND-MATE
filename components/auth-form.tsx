"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  mode: "login" | "register"
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { login, register, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "login") {
      const success = await login(email, password)
      if (!success) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
    } else {
      if (!name.trim()) {
        toast({
          title: "Registration failed",
          description: "Please enter your name",
          variant: "destructive",
        })
        return
      }

      const success = await register(email, password, name)
      if (!success) {
        toast({
          title: "Registration failed",
          description: "User with this email already exists",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          {mode === "login" ? "Welcome Back" : "Join MindMate"}
        </CardTitle>
        <CardDescription>
          {mode === "login" ? "Sign in to your account to continue" : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button type="button" onClick={onToggleMode} className="text-sm text-primary hover:underline">
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
