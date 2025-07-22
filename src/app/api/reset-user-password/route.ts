import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json(
        {
          error: "Failed to list users",
          details: listError.message,
        },
        { status: 500 }
      );
    }

    const user = users?.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
          details: `No user with email ${email}`,
        },
        { status: 404 }
      );
    }

    // Update the password
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
        email_confirm: true, // Also confirm email if needed
      });

    if (updateError) {
      return NextResponse.json(
        {
          error: "Failed to update password",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      email: email,
      userId: user.id,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
