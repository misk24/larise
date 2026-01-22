"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

interface MusicPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export function MusicPlayer({ audioRef }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg"
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      <span className="sr-only">{isPlaying ? "Matikan musik" : "Nyalakan musik"}</span>
    </Button>
  )
}
