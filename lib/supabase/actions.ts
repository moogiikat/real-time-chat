"use server"

import { createClient } from "@/lib/supabase/server"

export async function getChatMessages(roomName: string, limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_name", roomName)
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching chat messages:", error)
    return []
  }

  return data.map((message) => ({
    id: message.id,
    content: message.content,
    user: {
      name: message.user_name,
    },
    createdAt: message.created_at,
  }))
}

export async function saveChatMessage(message: {
  content: string
  user: { name: string }
  roomName: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("chat_messages").insert({
    content: message.content,
    user_name: message.user.name,
    room_name: message.roomName,
  })

  if (error) {
    console.error("Error saving chat message:", error)
    return false
  }

  return true
}

