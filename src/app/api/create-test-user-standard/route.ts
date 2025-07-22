import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Try standard signup with a more realistic email
    const testEmail = `test.user.${Date.now()}@gmail.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: "password123",
      options: {
        data: {
          first_name: "Test",
          last_name: "User",
        },
      },
    });

    if (error) {
      // Check if it's because user exists
      if (error.message.includes("already registered")) {
        // Try to sign in instead
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: testEmail,
            password: "password123",
          });

        if (signInError) {
          return NextResponse.json(
            {
              error: "User exists but cannot sign in",
              details: signInError.message,
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: "User already exists, signed in successfully",
          email: testEmail,
          password: "password123",
          session: signInData.session ? "Active" : "None",
        });
      }

      return NextResponse.json(
        {
          error: "Signup failed",
          details: error.message,
          code: error.code,
          status: error.status,
        },
        { status: 500 }
      );
    }

    // Auto sign in after signup
    if (data.user && !data.session) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: testEmail,
          password: "password123",
        });

      if (!signInError && signInData.session) {
        return NextResponse.json({
          message: "User created and signed in",
          email: testEmail,
          password: "password123",
          userId: data.user.id,
          session: "Active",
        });
      }
    }

    return NextResponse.json({
      message: "User created successfully",
      email: testEmail,
      password: "password123",
      userId: data.user?.id,
      session: data.session ? "Active" : "None",
      requiresConfirmation: !data.session,
    });
  } catch (error) {
    console.error("Create test user error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
