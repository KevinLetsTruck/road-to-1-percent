import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create admin client (requires service role key)
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

    // Try to create user
    const { data: user, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: "test-user@example.com",
        password: "password123",
        email_confirm: true,
        user_metadata: {
          first_name: "Test",
          last_name: "User",
        },
      });

    if (createError) {
      // If user exists, try to update password
      if (createError.message.includes("already been registered")) {
        const { data: users, error: listError } =
          await supabaseAdmin.auth.admin.listUsers();

        if (!listError && users) {
          const existingUser = users.users.find(
            (u) => u.email === "test-user@example.com"
          );
          if (existingUser) {
            const { error: updateError } =
              await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                password: "password123",
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
              message: "User already exists, password updated",
              email: "test-user@example.com",
              password: "password123",
            });
          }
        }
      }

      return NextResponse.json(
        {
          error: "Failed to create user",
          details: createError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Test user created successfully",
      email: "test-user@example.com",
      password: "password123",
      userId: user?.user?.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
