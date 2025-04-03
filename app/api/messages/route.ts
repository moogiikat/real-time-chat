import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, userName, roomName } = await request.json()

    if (!content || !userName || !roomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("chat_messages").insert({
      content,
      user_name: userName,
      room_name: roomName,
    })

    if (error) {
      console.error("Error saving message:", error)
      return NextResponse.json({ error: "Failed to save message", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const roomName = url.searchParams.get("roomName")

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_name", roomName)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    const messages = data.map((message) => ({
      id: message.id,
      content: message.content,
      user: {
        name: message.user_name,
      },
      createdAt: message.created_at,
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

