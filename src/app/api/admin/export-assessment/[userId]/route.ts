import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { createElement } from "react";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "bold",
  },
  scoreContainer: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  assessmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  assessmentItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  assessmentTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 3,
  },
  assessmentStatus: {
    fontSize: 10,
    color: "#6b7280",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#6b7280",
  },
});

// Simplified PDF Document Component for testing
const AssessmentReport = ({ data }: { data: any }) =>
  createElement(
    Document,
    {},
    createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      createElement(
        View,
        { style: styles.header },
        createElement(
          Text,
          { style: styles.title },
          "Success Probability Index (SPI)"
        ),
        createElement(Text, { style: styles.subtitle }, "Assessment Report")
      ),

      // Basic Client Information
      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.sectionTitle },
          "Client Information"
        ),
        createElement(
          Text,
          { style: styles.value },
          `Name: ${data.profile?.first_name || "N/A"} ${data.profile?.last_name || "N/A"}`
        ),
        createElement(
          Text,
          { style: styles.value },
          `Email: ${data.profile?.email || "N/A"}`
        ),
        createElement(
          Text,
          { style: styles.value },
          `SPI Score: ${data.progress?.spi_score || "Not Available"}`
        )
      ),

      // Footer
      createElement(
        View,
        { style: styles.footer },
        createElement(
          Text,
          { style: styles.footerText },
          `Generated on ${new Date().toLocaleDateString()}`
        )
      )
    )
  );

// POST /api/admin/export-assessment/[userId] - Export assessment as PDF
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

    console.log("PDF data:", {
      hasProfile: !!data.profile,
      hasProgress: !!data.progress,
      hasSpiAssessment: !!data.spiAssessment,
      hasComprehensiveAssessment: !!data.comprehensiveAssessment,
      profileName: data.profile
        ? `${data.profile.first_name} ${data.profile.last_name}`
        : "N/A",
    });

    // Generate PDF with error handling
    console.log("Starting PDF generation...");
    let pdfBuffer;
    try {
      const pdfDocument = AssessmentReport({ data });
      console.log("PDF document created, generating buffer...");
      pdfBuffer = await pdf(pdfDocument).toBuffer();
      console.log("PDF generated successfully");
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      const errorMessage = pdfError instanceof Error ? pdfError.message : String(pdfError);
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }

    // Return PDF as response
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="spi-assessment-${data.profile.first_name}-${data.profile.last_name}-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
