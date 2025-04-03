"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ChatMessageItem } from "@/components/chat-message"
import { useChatScroll } from "@/hooks/use-chat-scroll"
import { type ChatMessage, useRealtimeChat } from "@/hooks/use-realtime-chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Fetch messages from the database on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/messages?roomName=${encodeURIComponent(roomName)}`
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch messages")
        }
        const data = await response.json()
        setDbMessages(data.messages || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
        setError(
          error instanceof Error ? error.message : "Failed to load messages"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [roomName])

  // Merge realtime messages with initial messages and database messages
  const allMessages = useMemo(() => {
    const mergedMessages = [
      ...initialMessages,
      ...dbMessages,
      ...realtimeMessages,
    ]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    )

    return sortedMessages
  }, [initialMessages, dbMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected || isSending) return

      setIsSending(true)
      try {
        await sendMessage(newMessage)
        setNewMessage("")
      } finally {
        setIsSending(false)
      }
    },
    [newMessage, isConnected, sendMessage, isSending]
  )

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading messages...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 p-4">
            Error: {error}. Please try refreshing the page.
          </div>
        ) : allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground p-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message, index) => {
              const prevMessage = index > 0 ? allMessages[index - 1] : null
              const showHeader =
                !prevMessage || prevMessage.user.name !== message.user.name

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.user.name === username}
                    showHeader={showHeader}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex w-full gap-2 border-t border-border p-4"
      >
        <Input
          className={cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim() && !isSending
              ? "w-[calc(100%-36px)]"
              : "w-full"
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected || isSending}
        />
        {isConnected && newMessage.trim() && !isSending && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
          >
            <Send className="size-4" />
          </Button>
        )}
        {isSending && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            disabled
          >
            <Loader2 className="size-4 animate-spin" />
          </Button>
        )}
      </form>
    </div>
  )
}
