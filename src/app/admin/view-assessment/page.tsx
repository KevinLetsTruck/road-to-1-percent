"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  User,
  FileText,
  TrendingUp,
  Award,
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";

interface UserAssessment {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_test_user: boolean;
  assessment_date: string;
  total_spi_score: number;
  tier: string;
  standout_strength_1: string;
  standout_strength_2: string;
  spi_score: number;
  current_tier: string;
}

export default function ViewAssessment() {
  const [users, setUsers] = useState<UserAssessment[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAssessment | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preselectedUserId, setPreselectedUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if a specific user was selected via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectedUserId = urlParams.get("selectedUserId");
    
    if (selectedUserId) {
      setPreselectedUserId(selectedUserId);
    }
    
    loadUsers();
  }, []);

  // Handle user selection when users are loaded
  useEffect(() => {
    if (preselectedUserId && users.length > 0) {
      const user = users.find((u) => u.id === preselectedUserId);
      if (user) {
        setSelectedUser(user);
        fetchUserDetails(user.id);
        setPreselectedUserId(null); // Clear after selection
      }
    }
  }, [users, preselectedUserId]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingUserDetails(true);
      const response = await fetch(`/api/admin/user-assessment/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUserDetails(data);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const viewClientDashboard = (userId: string) => {
    // Open the client's dashboard page in a new tab with admin context
    const dashboardUrl = `/dashboard?admin=true&userId=${userId}`;
    window.open(dashboardUrl, "_blank");
  };

  const exportUserPdf = async (userId: string) => {
    try {
      setExportingPdf(true);

      // Get assessment data from API
      const response = await fetch(`/api/admin/export-assessment/${userId}`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          // Import jsPDF dynamically
          const { default: jsPDF } = await import("jspdf");

          // Create new PDF document
          const pdf = new jsPDF("p", "mm", "a4");

          // Add content to PDF
          const { profile, progress, spiAssessment, comprehensiveAssessment } =
            result.data;
          let yPosition = 30;

          // Header
          pdf.setFontSize(20);
          pdf.setTextColor(30, 58, 138); // Blue color
          pdf.text("Success Probability Index (SPI)", 20, yPosition);
          yPosition += 15;

          pdf.setFontSize(14);
          pdf.setTextColor(107, 114, 128); // Gray color
          pdf.text("Owner-Operator Readiness Assessment Report", 20, yPosition);
          yPosition += 20;

          // Client Information Section
          pdf.setFontSize(16);
          pdf.setTextColor(30, 58, 138);
          pdf.text("Client Information", 20, yPosition);
          yPosition += 10;

          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(
            "Name: " +
              (profile?.first_name || "N/A") +
              " " +
              (profile?.last_name || "N/A"),
            20,
            yPosition
          );
          yPosition += 8;
          pdf.text("Email: " + (profile?.email || "N/A"), 20, yPosition);
          yPosition += 8;
          pdf.text(
            "Member Since: " +
              new Date(profile?.created_at || Date.now()).toLocaleDateString(),
            20,
            yPosition
          );
          yPosition += 15;

          // Overall SPI Score Section
          if (progress?.spi_score) {
            pdf.setFontSize(16);
            pdf.setTextColor(30, 58, 138);
            pdf.text("Overall SPI Score", 20, yPosition);
            yPosition += 10;

            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text(
              "Success Probability Index: " + progress.spi_score,
              20,
              yPosition
            );
            yPosition += 8;
            if (progress.current_tier) {
              pdf.text("Current Tier: " + progress.current_tier, 20, yPosition);
              yPosition += 8;
            }
            if (progress.last_assessment_date) {
              pdf.text(
                "Last Assessment: " +
                  new Date(progress.last_assessment_date).toLocaleDateString(),
                20,
                yPosition
              );
              yPosition += 15;
            } else {
              yPosition += 10;
            }
          }

          // Assessment Completion Status
          if (progress) {
            pdf.setFontSize(16);
            pdf.setTextColor(30, 58, 138);
            pdf.text("Assessment Completion Status", 20, yPosition);
            yPosition += 10;

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            const assessments = [
              {
                key: "financial_foundation_completed",
                label: "Financial Foundation",
                score: progress.financial_foundation_score,
              },
              {
                key: "market_intelligence_completed",
                label: "Market Intelligence",
                score: progress.market_intelligence_score,
              },
              {
                key: "personal_strengths_completed",
                label: "Personal Strengths",
                score: progress.personal_strengths_score,
              },
              {
                key: "risk_management_completed",
                label: "Risk Management",
                score: progress.risk_management_score,
              },
              {
                key: "support_systems_completed",
                label: "Support Systems",
                score: progress.support_systems_score,
              },
            ];

            assessments.forEach((assessment) => {
              const completed = progress[assessment.key];
              const status = completed ? "✓ Completed" : "○ Not Completed";
              const scoreText = assessment.score
                ? ` - Score: ${assessment.score}`
                : "";
              // Fix text spacing issue by ensuring proper string concatenation
              const fullText = assessment.label + ": " + status + scoreText;
              pdf.text(fullText, 20, yPosition);
              yPosition += 8;
            });
            yPosition += 10;
          }

          // StandOut Assessment
          if (
            progress?.standout_completed ||
            comprehensiveAssessment?.standout_strength_1
          ) {
            pdf.setFontSize(16);
            pdf.setTextColor(30, 58, 138);
            pdf.text("StandOut Assessment", 20, yPosition);
            yPosition += 10;

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            if (comprehensiveAssessment?.standout_strength_1) {
              pdf.text(
                "Primary Strength: " +
                  comprehensiveAssessment.standout_strength_1,
                20,
                yPosition
              );
              yPosition += 8;
            }
            if (comprehensiveAssessment?.standout_strength_2) {
              pdf.text(
                "Secondary Strength: " +
                  comprehensiveAssessment.standout_strength_2,
                20,
                yPosition
              );
              yPosition += 8;
            }
            if (progress?.standout_score) {
              pdf.text(
                "StandOut Score: " + progress.standout_score,
                20,
                yPosition
              );
              yPosition += 8;
            }
            yPosition += 10;
          }

          // Financial Assessment
          if (spiAssessment || comprehensiveAssessment) {
            pdf.setFontSize(16);
            pdf.setTextColor(30, 58, 138);
            pdf.text("Financial Assessment", 20, yPosition);
            yPosition += 10;

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            if (comprehensiveAssessment?.net_worth) {
              pdf.text(
                "Net Worth: $" +
                  comprehensiveAssessment.net_worth.toLocaleString(),
                20,
                yPosition
              );
              yPosition += 8;
            }
            if (comprehensiveAssessment?.monthly_income) {
              pdf.text(
                "Monthly Income: $" +
                  comprehensiveAssessment.monthly_income.toLocaleString(),
                20,
                yPosition
              );
              yPosition += 8;
            }
            if (comprehensiveAssessment?.monthly_expenses) {
              pdf.text(
                "Monthly Expenses: $" +
                  comprehensiveAssessment.monthly_expenses.toLocaleString(),
                20,
                yPosition
              );
              yPosition += 8;
            }
            if (comprehensiveAssessment?.emergency_fund) {
              pdf.text(
                "Emergency Fund: $" +
                  comprehensiveAssessment.emergency_fund.toLocaleString(),
                20,
                yPosition
              );
              yPosition += 8;
            }
            yPosition += 10;
          }

          // Footer
          pdf.setFontSize(10);
          pdf.setTextColor(107, 114, 128);
          pdf.text(
            "Generated on " +
              new Date().toLocaleDateString() +
              " | Road to 1% Program",
            20,
            280
          );
          pdf.text(
            "This report is confidential and intended for authorized personnel only.",
            20,
            290
          );

          // Download the PDF
          const fileName =
            "spi-assessment-" +
            (profile?.first_name || "user") +
            "-" +
            new Date().toISOString().split("T")[0] +
            ".pdf";
          pdf.save(fileName);
        } else {
          throw new Error("Invalid response data");
        }
      } else {
        console.error("Failed to get assessment data");
        alert("Failed to export PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all users first
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, created_at, is_test_user")
        .order("created_at", { ascending: false });

      if (userError) throw userError;

      // Get user progress data separately
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("user_id, spi_score, current_tier");

      // Get comprehensive assessments data separately
      const { data: assessmentData } = await supabase
        .from("comprehensive_assessments")
        .select(
          "user_id, assessment_date, total_spi_score, tier, standout_strength_1, standout_strength_2"
        )
        .order("assessment_date", { ascending: false });

      // Process the data to combine everything
      const processedUsers =
        userData?.map((user) => {
          const progress =
            progressData?.find((p) => p.user_id === user.id) || {};
          const assessment =
            assessmentData?.find((a) => a.user_id === user.id) || {};

          return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            created_at: user.created_at,
            is_test_user: user.is_test_user,
            assessment_date: (assessment as any)?.assessment_date,
            total_spi_score: (assessment as any)?.total_spi_score,
            tier: (assessment as any)?.tier,
            standout_strength_1: (assessment as any)?.standout_strength_1,
            standout_strength_2: (assessment as any)?.standout_strength_2,
            spi_score: (progress as any)?.spi_score || 0,
            current_tier: (progress as any)?.current_tier,
          };
        }) || [];

      setUsers(processedUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "1%":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "9%":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "90%":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {preselectedUserId ? "Loading assessment..." : "Loading users..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                View User Assessments
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Search and view complete assessment results for any user
              </p>
            </div>
            {selectedUser && (
              <button
                onClick={() => viewClientDashboard(selectedUser.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Dashboard
              </button>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-1 ${selectedUser ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
          {/* User List - Hide when user is selected from dashboard */}
          {!selectedUser && (
            <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      fetchUserDetails(user.id);
                    }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.email}
                          </p>
                          {user.is_test_user && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                              Test
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.first_name} {user.last_name}
                        </p>
                        {user.spi_score > 0 && (
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-3 w-3 text-gray-400 mr-1" />
                            <span
                              className={`text-xs font-medium ${getScoreColor(user.spi_score)}`}
                            >
                              SPI: {user.spi_score}
                            </span>
                          </div>
                        )}
                      </div>
                      {user.spi_score > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* Assessment Details */}
          <div className={selectedUser ? "lg:col-span-1" : "lg:col-span-2"}>
            {selectedUser ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedUser.email}
                      </p>
                      {preselectedUserId === null && (
                        <button
                          onClick={() => setSelectedUser(null)}
                          className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          ← Show User List
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {selectedUser.is_test_user && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                          Test User
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {selectedUser.spi_score > 0 ? (
                    <div className="space-y-6">
                      {/* SPI Score */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Success Probability Index
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Overall assessment score
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-3xl font-bold ${getScoreColor(selectedUser.spi_score)}`}
                            >
                              {selectedUser.spi_score}
                            </div>
                            <div
                              className={`text-sm font-medium ${getTierColor(selectedUser.current_tier)} px-2 py-1 rounded`}
                            >
                              {selectedUser.current_tier} Tier
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Details */}
                      {selectedUser.assessment_date && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Assessment Date
                              </h4>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {new Date(
                                selectedUser.assessment_date
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Target className="h-5 w-5 text-gray-400 mr-2" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Assessment Tier
                              </h4>
                            </div>
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(selectedUser.tier)}`}
                            >
                              {selectedUser.tier}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detailed Assessment Data */}
                      {loadingUserDetails ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Loading detailed assessment...
                          </p>
                        </div>
                      ) : (
                        selectedUserDetails && (
                          <>
                            {/* Assessment Completion Status */}
                            {selectedUserDetails.spiAssessment && (
                              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    Assessment Completion Status
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  {[
                                    {
                                      key: "financial_foundation_completed",
                                      label: "Financial Foundation",
                                    },
                                    {
                                      key: "market_intelligence_completed",
                                      label: "Market Intelligence",
                                    },
                                    {
                                      key: "personal_strengths_completed",
                                      label: "Personal Strengths",
                                    },
                                    {
                                      key: "risk_management_completed",
                                      label: "Risk Management",
                                    },
                                    {
                                      key: "support_systems_completed",
                                      label: "Support Systems",
                                    },
                                  ].map(({ key, label }) => (
                                    <div
                                      key={key}
                                      className="flex items-center"
                                    >
                                      {selectedUserDetails.spiAssessment[
                                        key
                                      ] ? (
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                      )}
                                      <span
                                        className={
                                          selectedUserDetails.spiAssessment[key]
                                            ? "text-green-700 dark:text-green-400"
                                            : "text-gray-500 dark:text-gray-400"
                                        }
                                      >
                                        {label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Standout Strengths */}
                            {(selectedUser.standout_strength_1 ||
                              selectedUser.standout_strength_2 ||
                              selectedUserDetails.comprehensiveAssessment
                                ?.standout_strength_1) && (
                              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <Award className="h-5 w-5 text-gray-400 mr-2" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    Standout Strengths
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {(selectedUser.standout_strength_1 ||
                                    selectedUserDetails.comprehensiveAssessment
                                      ?.standout_strength_1) && (
                                    <div className="flex items-center">
                                      <span className="text-gray-500 dark:text-gray-400 w-20 text-sm">
                                        Primary:
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {selectedUser.standout_strength_1 ||
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.standout_strength_1}
                                      </span>
                                    </div>
                                  )}
                                  {(selectedUser.standout_strength_2 ||
                                    selectedUserDetails.comprehensiveAssessment
                                      ?.standout_strength_2) && (
                                    <div className="flex items-center">
                                      <span className="text-gray-500 dark:text-gray-400 w-20 text-sm">
                                        Secondary:
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {selectedUser.standout_strength_2 ||
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.standout_strength_2}
                                      </span>
                                    </div>
                                  )}
                                  {selectedUserDetails.progress
                                    ?.standout_score && (
                                    <div className="flex items-center">
                                      <span className="text-gray-500 dark:text-gray-400 w-20 text-sm">
                                        Score:
                                      </span>
                                      <span className="text-gray-900 dark:text-white font-medium">
                                        {
                                          selectedUserDetails.progress
                                            .standout_score
                                        }
                                        /10
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Financial Assessment */}
                            {(selectedUserDetails.comprehensiveAssessment ||
                              selectedUserDetails.spiAssessment) && (
                              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <Target className="h-5 w-5 text-gray-400 mr-2" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    Financial Assessment
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">
                                      Net Worth:
                                    </span>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {(() => {
                                        const netWorth =
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.net_worth ||
                                          selectedUserDetails.spiAssessment
                                            ?.net_worth;
                                        return netWorth && netWorth > 0
                                          ? `$${netWorth.toLocaleString()}`
                                          : "Not provided";
                                      })()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">
                                      Monthly Income:
                                    </span>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {(() => {
                                        const income =
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.monthly_income ||
                                          selectedUserDetails.spiAssessment
                                            ?.monthly_income;
                                        return income && income > 0
                                          ? `$${income.toLocaleString()}`
                                          : "Not provided";
                                      })()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">
                                      Monthly Expenses:
                                    </span>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {(() => {
                                        const expenses =
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.monthly_expenses ||
                                          selectedUserDetails.spiAssessment
                                            ?.monthly_expenses;
                                        return expenses && expenses > 0
                                          ? `$${expenses.toLocaleString()}`
                                          : "Not provided";
                                      })()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1">
                                      Emergency Fund:
                                    </span>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {(() => {
                                        const emergency =
                                          selectedUserDetails
                                            .comprehensiveAssessment
                                            ?.emergency_fund ||
                                          selectedUserDetails.spiAssessment
                                            ?.emergency_fund_months;
                                        if (
                                          selectedUserDetails.spiAssessment
                                            ?.emergency_fund_months
                                        ) {
                                          return `${emergency} months`;
                                        }
                                        return emergency && emergency > 0
                                          ? `$${emergency.toLocaleString()}`
                                          : "Not provided";
                                      })()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      )}

                      {/* User Info */}
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            User Information
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Member since:
                            </span>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(
                                selectedUser.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Account type:
                            </span>
                            <p className="text-gray-900 dark:text-white">
                              {selectedUser.is_test_user
                                ? "Test Account"
                                : "Regular Account"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Assessment Completed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This user hasn't completed their assessment yet.
                      </p>

                      <div className="mt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          💡 Use "View Dashboard" button above to see their
                          current progress
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a User
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a user from the list to view their complete
                    assessment results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
