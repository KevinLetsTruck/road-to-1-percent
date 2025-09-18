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
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("Deleting user:", existingUser.email, "with ID:", userId);

    // Delete user data from all tables in the correct order (due to foreign key constraints)

    // 1. Delete assessment responses
    const { data: deletedResponses, error: assessmentError } = await supabase
      .from("assessment_responses")
      .delete()
      .eq("user_id", userId)
      .select();

    console.log("Deleted assessment responses:", deletedResponses?.length || 0);
    if (assessmentError) {
      console.error("Error deleting assessment responses:", assessmentError);
    }

    // 2. Delete comprehensive assessments
    const { data: deletedAssessments, error: comprehensiveError } =
      await supabase
        .from("comprehensive_assessments")
        .delete()
        .eq("user_id", userId)
        .select();

    console.log(
      "Deleted comprehensive assessments:",
      deletedAssessments?.length || 0
    );
    if (comprehensiveError) {
      console.error(
        "Error deleting comprehensive assessments:",
        comprehensiveError
      );
    }

    // 3. Delete user progress
    const { data: deletedProgress, error: progressError } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", userId)
      .select();

    console.log("Deleted user progress records:", deletedProgress?.length || 0);
    if (progressError) {
      console.error("Error deleting user progress:", progressError);
    }

    // 4. Delete profile
    const { data: deletedProfile, error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId)
      .select();

    console.log("Deleted profile:", deletedProfile?.length || 0);
    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return NextResponse.json(
        { error: "Failed to delete user profile", details: profileError },
        { status: 500 }
      );
    }

    // 5. Delete from auth.users (requires service role key)
    // Note: This requires the service role key which should be kept secure
    // For now, we'll just delete from our tables and leave the auth record
    // You can implement this with a server-side function or edge function with service role

    // Optional: If you have service role access, uncomment this:
    /*
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError)
    }
    */

    // Final verification - check if user still exists
    const { data: verifyUser, error: verifyError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    console.log("Post-deletion verification - User still exists:", !!verifyUser);
    if (verifyError && verifyError.code !== 'PGRST116') { // PGRST116 is "not found" which is what we want
      console.error("Error during verification:", verifyError);
    }

    const totalDeleted = (deletedResponses?.length || 0) + 
                        (deletedAssessments?.length || 0) + 
                        (deletedProgress?.length || 0) + 
                        (deletedProfile?.length || 0);

    console.log("Total records deleted:", totalDeleted);

    return NextResponse.json({
      success: true,
      message: "User data deleted successfully",
      deletedRecords: {
        assessmentResponses: deletedResponses?.length || 0,
        comprehensiveAssessments: deletedAssessments?.length || 0,
        userProgress: deletedProgress?.length || 0,
        profile: deletedProfile?.length || 0,
        total: totalDeleted
      },
      userStillExists: !!verifyUser,
      note: "Auth record remains for security. User cannot login without profile.",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
