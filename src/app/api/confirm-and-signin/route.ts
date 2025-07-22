import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createClient();

    // First, try to sign in
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (!signInError && signInData.session) {
      return NextResponse.json({
        success: true,
        message: "Signed in successfully",
        session: "Active",
        user: signInData.user?.email,
      });
    }

    // If sign in failed, log the specific error
    console.error("Sign in error:", signInError);

    // Check if it's an email confirmation issue
    if (signInError?.message?.includes("Email not confirmed")) {
      return NextResponse.json(
        {
          error: "Email not confirmed",
          details: "Please check your email for confirmation link",
          code: signInError.code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Sign in failed",
        details: signInError?.message || "Unknown error",
        code: signInError?.code,
        status: signInError?.status,
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
