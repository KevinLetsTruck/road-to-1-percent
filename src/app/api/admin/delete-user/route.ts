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

    // Try to use the database function first, fall back to manual deletion if it doesn't exist
    let deleteResult = null;
    let useManualDeletion = false;

    try {
      const { data: dbFunctionResult, error: dbFunctionError } =
        await supabase.rpc("delete_user_completely", { user_id: userId });

      console.log("Database function result:", dbFunctionResult);

      if (dbFunctionError) {
        console.log(
          "Database function not available, using manual deletion:",
          dbFunctionError
        );
        useManualDeletion = true;
      } else if (dbFunctionResult && !dbFunctionResult.success) {
        console.error(
          "Database function returned error:",
          dbFunctionResult.error
        );
        return NextResponse.json(
          { error: dbFunctionResult.error },
          { status: 400 }
        );
      } else {
        deleteResult = dbFunctionResult;
      }
    } catch (error) {
      console.log(
        "Database function call failed, using manual deletion:",
        error
      );
      useManualDeletion = true;
    }

    // Manual deletion if database function is not available
    if (useManualDeletion) {
      console.log("Performing manual deletion...");

      // Delete user data from all tables in the correct order (due to foreign key constraints)

      // 1. Delete SPI assessments
      const { data: deletedSpiAssessments, error: spiAssessmentError } =
        await supabase
          .from("spi_assessments")
          .delete()
          .eq("user_id", userId)
          .select();

      console.log(
        "Deleted SPI assessments:",
        deletedSpiAssessments?.length || 0
      );
      if (spiAssessmentError) {
        console.error("Error deleting SPI assessments:", spiAssessmentError);
        console.error(
          "SPI assessment error details:",
          JSON.stringify(spiAssessmentError, null, 2)
        );
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
        console.error(
          "Comprehensive error details:",
          JSON.stringify(comprehensiveError, null, 2)
        );
      }

      // 3. Delete user progress
      const { data: deletedProgress, error: progressError } = await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", userId)
        .select();

      console.log(
        "Deleted user progress records:",
        deletedProgress?.length || 0
      );
      if (progressError) {
        console.error("Error deleting user progress:", progressError);
        console.error(
          "Progress error details:",
          JSON.stringify(progressError, null, 2)
        );
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
        console.error(
          "Profile error details:",
          JSON.stringify(profileError, null, 2)
        );
        return NextResponse.json(
          { error: "Failed to delete user profile", details: profileError },
          { status: 500 }
        );
      }

      // Create a result object for manual deletion
      deleteResult = {
        success: true,
        message: "User deleted successfully (manual deletion)",
        deletedRecords: {
          spiAssessments: deletedSpiAssessments?.length || 0,
          comprehensiveAssessments: deletedAssessments?.length || 0,
          userProgress: deletedProgress?.length || 0,
          profile: deletedProfile?.length || 0,
        },
      };
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
      message: deleteResult?.message || "User deleted successfully",
      deleteResult: deleteResult,
      userStillExistsInProfiles: !!verifyUser,
      userStillExistsInAuth: !!verifyAuthUser,
      note: useManualDeletion
        ? "User data deleted from application tables. Auth record may remain for security."
        : "User has been completely removed from all tables including auth.users",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
