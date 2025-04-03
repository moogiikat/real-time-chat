"use client";

import type React from "react";

import { useState } from "react";
import { RealtimeChat } from "@/components/realtime-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("general");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomName.trim()) {
      setIsJoined(true);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl h-[calc(100vh-2rem)]">
      {!isJoined ? (
        <Card className="w-full max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join Chat</CardTitle>
            <CardDescription>
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
              <Button type="submit" className="w-full">
                Join Chat
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 p-2 bg-card rounded-lg shadow">
            <div>
              <h1 className="text-xl font-bold">Room: {roomName}</h1>
              <p className="text-sm text-muted-foreground">
                Chatting as: {username}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsJoined(false)}>
              Leave Room
            </Button>
          </div>
          <div className="flex-1 border rounded-lg overflow-hidden shadow-lg">
            <RealtimeChat roomName={roomName} username={username} />
          </div>
        </div>
      )}
    </div>
  );
}
