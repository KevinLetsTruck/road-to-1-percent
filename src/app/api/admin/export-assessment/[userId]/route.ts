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

// PDF Document Component using createElement to avoid JSX syntax issues
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
        createElement(
          Text,
          { style: styles.subtitle },
          "Owner-Operator Readiness Assessment Report"
        ),
        createElement(Text, { style: styles.subtitle }, "Road to 1% Program")
      ),

      // Client Information
      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.sectionTitle },
          "Client Information"
        ),
        createElement(
          View,
          { style: styles.infoGrid },
          createElement(
            View,
            { style: styles.infoItem },
            createElement(Text, { style: styles.label }, "Name"),
            createElement(
              Text,
              { style: styles.value },
              `${data.profile?.first_name} ${data.profile?.last_name}`
            )
          ),
          createElement(
            View,
            { style: styles.infoItem },
            createElement(Text, { style: styles.label }, "Email"),
            createElement(Text, { style: styles.value }, data.profile?.email)
          )
        ),
        createElement(
          View,
          { style: styles.infoGrid },
          createElement(
            View,
            { style: styles.infoItem },
            createElement(Text, { style: styles.label }, "Assessment Date"),
            createElement(
              Text,
              { style: styles.value },
              data.progress?.last_assessment_date
                ? new Date(
                    data.progress.last_assessment_date
                  ).toLocaleDateString()
                : "N/A"
            )
          ),
          createElement(
            View,
            { style: styles.infoItem },
            createElement(Text, { style: styles.label }, "Current Tier"),
            createElement(
              Text,
              { style: styles.value },
              data.progress?.current_tier || "Not Assigned"
            )
          )
        )
      ),

      // Overall SPI Score
      ...(data.progress?.spi_score
        ? [
            createElement(
              View,
              { style: styles.section },
              createElement(
                Text,
                { style: styles.sectionTitle },
                "Overall SPI Score"
              ),
              createElement(
                View,
                { style: styles.scoreContainer },
                createElement(
                  Text,
                  { style: styles.scoreTitle },
                  "Success Probability Index"
                ),
                createElement(
                  Text,
                  { style: styles.scoreValue },
                  data.progress.spi_score.toString()
                )
              )
            ),
          ]
        : []),

      // Assessment Completion Status
      createElement(
        View,
        { style: styles.section },
        createElement(
          Text,
          { style: styles.sectionTitle },
          "Assessment Completion Status"
        ),
        createElement(
          View,
          { style: styles.assessmentGrid },
          [
            "financial_foundation",
            "market_intelligence",
            "personal_strengths",
            "risk_management",
            "support_systems",
          ].map((key, index) => {
            const label = key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            const completed = data.progress?.[`${key}_completed`];
            const score = data.progress?.[`${key}_score`];
            return createElement(
              View,
              { key: index, style: styles.assessmentItem },
              createElement(Text, { style: styles.assessmentTitle }, label),
              createElement(
                Text,
                { style: styles.assessmentStatus },
                `${completed ? "Completed" : "Not Completed"}${score ? ` - Score: ${score}` : ""}`
              )
            );
          })
        )
      ),

      // StandOut Assessment
      ...(data.progress?.standout_completed
        ? [
            createElement(
              View,
              { style: styles.section },
              createElement(
                Text,
                { style: styles.sectionTitle },
                "StandOut Assessment"
              ),
              createElement(
                View,
                { style: styles.infoGrid },
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(Text, { style: styles.label }, "Primary Role"),
                  createElement(
                    Text,
                    { style: styles.value },
                    data.progress.standout_role_1 || "N/A"
                  )
                ),
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "Secondary Role"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    data.progress.standout_role_2 || "N/A"
                  )
                )
              ),
              createElement(
                View,
                { style: styles.infoGrid },
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "Strength Combination"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    data.progress.strength_combination || "N/A"
                  )
                ),
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "StandOut Score"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    data.progress.standout_score?.toString() || "N/A"
                  )
                )
              )
            ),
          ]
        : []),

      // Financial Details
      ...(data.spiAssessment
        ? [
            createElement(
              View,
              { style: styles.section },
              createElement(
                Text,
                { style: styles.sectionTitle },
                "Financial Assessment Details"
              ),
              createElement(
                View,
                { style: styles.infoGrid },
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(Text, { style: styles.label }, "Net Worth"),
                  createElement(
                    Text,
                    { style: styles.value },
                    `$${(
                      (data.spiAssessment.cash_checking || 0) +
                      (data.spiAssessment.savings || 0) +
                      (data.spiAssessment.investments || 0) +
                      (data.spiAssessment.retirement || 0) +
                      (data.spiAssessment.real_estate || 0) +
                      (data.spiAssessment.vehicles || 0) +
                      (data.spiAssessment.equipment || 0) +
                      (data.spiAssessment.other_assets || 0) -
                      (data.spiAssessment.credit_cards || 0) -
                      (data.spiAssessment.auto_loans || 0) -
                      (data.spiAssessment.mortgage || 0) -
                      (data.spiAssessment.equipment_loans || 0) -
                      (data.spiAssessment.personal_loans || 0) -
                      (data.spiAssessment.other_debts || 0)
                    ).toLocaleString()}`
                  )
                ),
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "Monthly Income"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    `$${data.spiAssessment.monthly_income?.toLocaleString() || "N/A"}`
                  )
                )
              ),
              createElement(
                View,
                { style: styles.infoGrid },
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "Monthly Expenses"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    `$${data.spiAssessment.monthly_expenses?.toLocaleString() || "N/A"}`
                  )
                ),
                createElement(
                  View,
                  { style: styles.infoItem },
                  createElement(
                    Text,
                    { style: styles.label },
                    "Emergency Fund"
                  ),
                  createElement(
                    Text,
                    { style: styles.value },
                    `${data.spiAssessment.emergency_fund_months || 0} months`
                  )
                )
              )
            ),
          ]
        : []),

      // Footer
      createElement(
        View,
        { style: styles.footer },
        createElement(
          Text,
          { style: styles.footerText },
          `Generated on ${new Date().toLocaleDateString()} | Road to 1% Program`
        ),
        createElement(
          Text,
          { style: styles.footerText },
          "This report is confidential and intended for authorized personnel only."
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

    console.log("PDF data:", JSON.stringify(data, null, 2));

    // Generate PDF
    console.log("Starting PDF generation...");
    const pdfBuffer = await pdf(AssessmentReport({ data })).toBuffer();
    console.log("PDF generated successfully, buffer size:", pdfBuffer.length);

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
