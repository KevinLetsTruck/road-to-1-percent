import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({
        authenticated: false,
        error: error.message,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: !!user,
      user: user
        ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
          }
        : null,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error",
        user: null,
      },
      { status: 500 }
    );
  }
}
