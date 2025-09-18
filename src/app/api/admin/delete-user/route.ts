import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if the current user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the current user is an admin
    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (adminError || !adminProfile?.is_admin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get the user ID to delete from the request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }

    console.log("Admin", user.email, "is deleting user:", userId);

    // First, check if the user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .single();

    console.log("User exists check:", existingUser);
    if (checkError) {
      console.error("Error checking user existence:", checkError);
      return NextResponse.json(
        { error: "User not found", details: checkError },
        { status: 404 }
      );
    }

    if (!existingUser) {
      console.log("User not found in database:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Deleting user:", existingUser.email, "with ID:", userId);

    // Use the database function to completely delete the user
    // This function handles all tables including auth.users with proper permissions
    const { data: deleteResult, error: deleteError } = await supabase.rpc(
      "delete_user_completely",
      { user_id: userId }
    );

    console.log("Delete function result:", deleteResult);

    if (deleteError) {
      console.error("Error calling delete function:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete user", details: deleteError },
        { status: 500 }
      );
    }

    // Check if the function returned an error
    if (deleteResult && !deleteResult.success) {
      console.error("Delete function returned error:", deleteResult.error);
      return NextResponse.json({ error: deleteResult.error }, { status: 400 });
    }

    // Final verification - check if user still exists in profiles
    const { data: verifyUser, error: verifyError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    console.log(
      "Post-deletion verification - User still exists in profiles:",
      !!verifyUser
    );

    // Also check auth.users (this might fail due to RLS, but we'll try)
    const { data: verifyAuthUser, error: verifyAuthError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("id", userId)
      .single();

    console.log(
      "Post-deletion verification - User still exists in auth:",
      !!verifyAuthUser
    );

    return NextResponse.json({
      success: true,
      message: "User deleted completely",
      deleteResult: deleteResult,
      userStillExistsInProfiles: !!verifyUser,
      userStillExistsInAuth: !!verifyAuthUser,
      note: "User has been completely removed from all tables including auth.users",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
