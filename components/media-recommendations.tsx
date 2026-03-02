"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Film, Music, RefreshCw, Star } from "lucide-react"

interface MoodEntry {
  id: number
  date: string
  mood: string
  moodValue: string
  note: string
  label: string
}

interface MediaItem {
  id: string
  title: string
  type: "movie" | "song"
  genre: string
  description: string
  rating: number
  year?: number
  artist?: string
  director?: string
}

// Sample media recommendations based on mood
const MEDIA_RECOMMENDATIONS: Record<string, MediaItem[]> = {
  happy: [
    {
      id: "1",
      title: "The Grand Budapest Hotel",
      type: "movie",
      genre: "Comedy",
      description: "A whimsical comedy-drama that celebrates life's beautiful moments",
      rating: 4.8,
      year: 2014,
      director: "Wes Anderson",
    },
    {
      id: "2",
      title: "Happy",
      type: "song",
      genre: "Pop",
      description: "An upbeat anthem that amplifies your joyful mood",
      rating: 4.6,
      artist: "Pharrell Williams",
    },
    {
      id: "3",
      title: "Paddington 2",
      type: "movie",
      genre: "Family",
      description: "Heartwarming adventure that spreads pure joy",
      rating: 4.9,
      year: 2017,
      director: "Paul King",
    },
  ],
  sad: [
    {
      id: "4",
      title: "Inside Out",
      type: "movie",
      genre: "Animation",
      description: "A beautiful exploration of emotions that validates your feelings",
      rating: 4.7,
      year: 2015,
      director: "Pete Docter",
    },
    {
      id: "5",
      title: "Mad World",
      type: "song",
      genre: "Alternative",
      description: "A haunting melody that resonates with melancholy",
      rating: 4.5,
      artist: "Gary Jules",
    },
    {
      id: "6",
      title: "Her",
      type: "movie",
      genre: "Drama",
      description: "A thoughtful film about connection and healing",
      rating: 4.6,
      year: 2013,
      director: "Spike Jonze",
    },
  ],
  anxious: [
    {
      id: "7",
      title: "Studio Ghibli Collection",
      type: "movie",
      genre: "Animation",
      description: "Calming, beautiful films that soothe anxiety",
      rating: 4.9,
      year: 2001,
      director: "Hayao Miyazaki",
    },
    {
      id: "8",
      title: "Weightless",
      type: "song",
      genre: "Ambient",
      description: "Scientifically designed to reduce anxiety by 65%",
      rating: 4.8,
      artist: "Marconi Union",
    },
  ],
  excited: [
    {
      id: "9",
      title: "Baby Driver",
      type: "movie",
      genre: "Action",
      description: "High-energy heist film with incredible music",
      rating: 4.7,
      year: 2017,
      director: "Edgar Wright",
    },
    {
      id: "10",
      title: "Can't Stop the Feeling!",
      type: "song",
      genre: "Pop",
      description: "Infectious energy that matches your excitement",
      rating: 4.5,
      artist: "Justin Timberlake",
    },
  ],
  calm: [
    {
      id: "11",
      title: "Lost in Translation",
      type: "movie",
      genre: "Drama",
      description: "A peaceful, contemplative journey through Tokyo",
      rating: 4.6,
      year: 2003,
      director: "Sofia Coppola",
    },
    {
      id: "12",
      title: "River",
      type: "song",
      genre: "Folk",
      description: "Gentle melodies that enhance your peaceful state",
      rating: 4.7,
      artist: "Joni Mitchell",
    },
  ],
}

export function MediaRecommendations() {
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<MediaItem[]>([])
  const [recentMoods, setRecentMoods] = useState<string[]>([])

  useEffect(() => {
    // Get recent mood entries
    const entries: MoodEntry[] = JSON.parse(localStorage.getItem("moodEntries") || "[]")

    if (entries.length > 0) {
      // Get the most recent mood
      const latestEntry = entries[entries.length - 1]
      setCurrentMood(latestEntry.moodValue)

      // Get recent unique moods for variety
      const recent = entries
        .slice(-7)
        .map((entry) => entry.moodValue)
        .filter((mood, index, arr) => arr.indexOf(mood) === index)

      setRecentMoods(recent)
      generateRecommendations(latestEntry.moodValue, recent)
    }
  }, [])

  const generateRecommendations = (primaryMood: string, moods: string[]) => {
    let allRecommendations: MediaItem[] = []

    // Add recommendations for primary mood
    if (MEDIA_RECOMMENDATIONS[primaryMood]) {
      allRecommendations = [...MEDIA_RECOMMENDATIONS[primaryMood]]
    }

    // Add variety from other recent moods
    moods.forEach((mood) => {
      if (mood !== primaryMood && MEDIA_RECOMMENDATIONS[mood]) {
        allRecommendations = [...allRecommendations, ...MEDIA_RECOMMENDATIONS[mood].slice(0, 1)]
      }
    })

    // Shuffle and limit recommendations
    const shuffled = allRecommendations.sort(() => Math.random() - 0.5)
    setRecommendations(shuffled.slice(0, 6))
  }

  const refreshRecommendations = () => {
    if (currentMood) {
      generateRecommendations(currentMood, recentMoods)
    }
  }

  if (!currentMood) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-xl font-semibold mb-2">No mood data yet</h3>
        <p className="text-muted-foreground mb-6">Log your first mood to get personalized media recommendations!</p>
        <Button onClick={() => window.location.reload()}>Check for Mood Entries</Button>
      </div>
    )
  }

  const movies = recommendations.filter((item) => item.type === "movie")
  const songs = recommendations.filter((item) => item.type === "song")

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Personalized Recommendations</h2>
        <p className="text-muted-foreground mb-4">
          Based on your recent mood:{" "}
          <Badge variant="outline" className="capitalize">
            {currentMood}
          </Badge>
        </p>
        <Button variant="outline" onClick={refreshRecommendations}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Recommendations
        </Button>
      </div>

      {/* Movies Section */}
      {movies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5" />
              Movies for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {movies.map((movie) => (
                <Card key={movie.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {movie.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary">{movie.genre}</Badge>
                      {movie.year && <Badge variant="outline">{movie.year}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{movie.description}</p>
                    {movie.director && <p className="text-xs text-muted-foreground">Directed by {movie.director}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Songs Section */}
      {songs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Songs for Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {songs.map((song) => (
                <Card key={song.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{song.title}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {song.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary">{song.genre}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{song.description}</p>
                    {song.artist && <p className="text-xs text-muted-foreground">by {song.artist}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wellness Tip */}
      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-3">💡</div>
          <h3 className="font-semibold mb-2">Wellness Tip</h3>
          <p className="text-sm text-muted-foreground">
            Engaging with media that matches or uplifts your mood can be a powerful tool for emotional regulation. Take
            time to reflect on how these recommendations make you feel!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
