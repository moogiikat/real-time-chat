"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

import { RealtimeChat } from "@/components/realtime-chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  const [username, setUsername] = useState("")
  const [roomName, setRoomName] = useState("general")
  const [isJoined, setIsJoined] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<string[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<string[]>([])

  const fetchRooms = async () => {
    setIsLoadingRooms(true)
    try {
      const response = await fetch(`/api/rooms`)
      if (response.ok) {
        const data = await response.json()
        setAvailableRooms(data.rooms || [])
      } else {
        console.error("Failed to fetch rooms")
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users`)
      if (response.ok) {
        const data = await response.json()
        setAvailableUsers(data.users || [])
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchRooms()
    fetchUsers()
  }, [])

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && roomName.trim()) {
      setIsJoined(true)
    }
  }

  const handleRoomSelect = (room: string) => {
    setRoomName(room)
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl h-[calc(100vh-2rem)]">
      {!isJoined ? (
        <div className="flex items-center justify-center h-full">
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Image
              src="/profile.png"
              alt="logo"
              width={500}
              height={500}
              className="w-full h-auto rounded-lg object-cover hidden md:block"
            />
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Welcome to the Chat Room
                </CardTitle>
                {availableUsers.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    (Users in system: {availableUsers.length})
                  </p>
                )}
                <CardDescription className="text-start">
                  You can join an existing room or create your own to enjoy with
                  friends. Your username will be your ID, so please be careful.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="room" className="text-sm font-medium">
                      Room
                    </label>
                    <Input
                      id="room"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      required
                    />
                  </div>

                  {isLoadingRooms ? (
                    <p className="text-sm text-center text-muted-foreground">
                      Loading available rooms...
                    </p>
                  ) : availableRooms.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Available Rooms:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableRooms.map((room) => (
                          <Button
                            key={room}
                            type="button"
                            variant={roomName === room ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleRoomSelect(room)}
                          >
                            {room}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-center text-muted-foreground">
                      No existing rooms found
                    </p>
                  )}

                  <Button type="submit" className="w-full">
                    Join Chat
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 p-4 bg-card rounded-lg shadow-md border border-border/40">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>{roomName}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Room
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Chatting as:
                <span className="font-medium text-foreground">{username}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => {
                setIsJoined(false)
                // fetch rooms and users again
                fetchRooms()
                fetchUsers()
              }}
            >
              <span>Leave Room</span>
            </Button>
          </div>
          <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-card/50">
            <RealtimeChat roomName={roomName} username={username} />
          </div>
        </div>
      )}
    </div>
  )
}
