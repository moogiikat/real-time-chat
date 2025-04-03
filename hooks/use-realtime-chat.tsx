"use client"

import { createClient } from "@/lib/supabase/client"
import { useCallback, useEffect, useState } from "react"

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

const EVENT_MESSAGE_TYPE = "message"

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        setMessages((current) => [...current, payload.payload as ChatMessage])
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      }

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      // Send message through realtime channel
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })

      // Save message to database
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message.content,
            userName: username,
            roomName,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Failed to save message to database:", errorData)
        }
      } catch (error) {
        console.error("Error saving message:", error)
      }
    },
    [channel, isConnected, username, roomName],
  )

  return { messages, sendMessage, isConnected }
}

