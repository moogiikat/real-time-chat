import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_messages")
      .select("room_name")
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Error fetching rooms:", error);
      return NextResponse.json(
        { error: "Failed to fetch rooms" },
        { status: 500 }
      );
    }

    const rooms = [...new Set(data.map((room) => room.room_name))];

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
