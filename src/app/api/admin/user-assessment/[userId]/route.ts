import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

// GET /api/admin/user-assessment/[userId] - Get detailed assessment data for a user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createClient();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.userId)
      .single();

    if (profileError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", params.userId)
      .single();

    if (progressError) {
      return NextResponse.json({
        profile,
        progress: null,
        spiAssessment: null,
        comprehensiveAssessment: null,
      });
    }

    // Get SPI assessment data if available
    const { data: spiAssessment } = await supabase
      .from("spi_assessments")
      .select("*")
      .eq("user_id", params.userId)
      .order("assessment_date", { ascending: false })
      .limit(1)
      .single();

    // Get comprehensive assessment data if available
    const { data: comprehensiveAssessment } = await supabase
      .from("comprehensive_assessments")
      .select("*")
      .eq("user_id", params.userId)
      .order("assessment_date", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      profile,
      progress,
      spiAssessment,
      comprehensiveAssessment,
    });
  } catch (error) {
    console.error("Error fetching user assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
