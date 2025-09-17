import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Generate HTML content for the assessment report
function generateAssessmentHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SPI Assessment Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #1e3a8a; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e3a8a; 
            margin: 0; 
        }
        .subtitle { 
            font-size: 16px; 
            color: #6b7280; 
            margin: 10px 0 0 0; 
        }
        .section { 
            margin-bottom: 25px; 
        }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e3a8a; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 5px; 
            margin-bottom: 15px; 
        }
        .info-item { 
            margin-bottom: 10px; 
            font-size: 14px; 
        }
        .label { 
            font-weight: bold; 
            color: #374151; 
        }
        .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Success Probability Index (SPI)</h1>
        <p class="subtitle">Assessment Report</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">Client Information</h2>
        <div class="info-item">
            <span class="label">Name:</span> ${data.profile?.first_name || "N/A"} ${data.profile?.last_name || "N/A"}
        </div>
        <div class="info-item">
            <span class="label">Email:</span> ${data.profile?.email || "N/A"}
        </div>
        <div class="info-item">
            <span class="label">SPI Score:</span> ${data.progress?.spi_score || "Not Available"}
        </div>
        ${
          data.progress?.current_tier
            ? `
        <div class="info-item">
            <span class="label">Current Tier:</span> ${data.progress.current_tier}
        </div>
        `
            : ""
        }
    </div>
    
    <div class="footer">
        Generated on ${new Date().toLocaleDateString()} | Road to 1% Program<br>
        This report is confidential and intended for authorized personnel only.
    </div>
</body>
</html>
  `.trim();
}

// POST /api/admin/export-assessment/[userId] - Export assessment as HTML
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  try {
    const supabase = await createClient();

    // Fetch profile first (required)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.userId)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch optional assessment data (don't fail if missing)
    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", params.userId)
      .maybeSingle();

    const { data: spiAssessment } = await supabase
      .from("spi_assessments")
      .select("*")
      .eq("user_id", params.userId)
      .order("assessment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: comprehensiveAssessment } = await supabase
      .from("comprehensive_assessments")
      .select("*")
      .eq("user_id", params.userId)
      .order("assessment_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const data = {
      profile,
      progress,
      spiAssessment,
      comprehensiveAssessment,
    };

    console.log("Assessment data:", {
      hasProfile: !!data.profile,
      hasProgress: !!data.progress,
      hasSpiAssessment: !!data.spiAssessment,
      hasComprehensiveAssessment: !!data.comprehensiveAssessment,
      profileName: data.profile
        ? `${data.profile.first_name} ${data.profile.last_name}`
        : "N/A",
    });

    // Return assessment data for client-side PDF generation
    console.log("Returning assessment data for client-side PDF generation...");

    return NextResponse.json({
      success: true,
      data: {
        profile: data.profile,
        progress: data.progress,
        spiAssessment: data.spiAssessment,
        comprehensiveAssessment: data.comprehensiveAssessment,
        htmlContent: generateAssessmentHTML(data),
      },
    });
  } catch (error) {
    console.error("Error generating assessment report:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment report" },
      { status: 500 }
    );
  }
}
