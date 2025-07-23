/**
 * Dashboard Page
 * Updated: December 2024
 * - Added rounded corners (16px) to all buttons
 * - Redesigned Success Probability card with orange gradient
 * - Improved text contrast and styling
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateStandoutScore } from "@/lib/standoutScoring";
import {
  Download,
  FileText,
  RefreshCw,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Zap,
  DollarSign,
  Globe,
  Shield,
  Users2,
  Check,
} from "lucide-react";
import PDFDownloadButton from "@/components/PDFDownloadButton";

interface DashboardStats {
  successProbability: number;
  completedAssessments: number;
  strongestDimension: string;
  improvementArea: string;
  lastAssessmentDate: string | null;
  standoutStrength1: string | null;
  standoutStrength2: string | null;
}

interface DimensionData {
  name: string;
  score: number;
  max: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  quickWins: string[];
  longTermGoals: string[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch user profile for name
        const { data: profileData } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        // Fetch user progress
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Merge profile data with progress data
        if (progressData && profileData) {
          setUserProgress({
            ...progressData,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
          });
        } else {
          setUserProgress(progressData);
        }

        // Fetch latest assessment for standout strengths
        const { data: assessmentData } = await supabase
          .from("comprehensive_assessments")
          .select("*")
          .eq("user_id", user.id)
          .order("assessment_date", { ascending: false })
          .limit(1)
          .single();

        if (progressData) {
          // Calculate stats
          const dimensions = [
            {
              name: "Financial Foundation",
              score: progressData.financial_foundation_score || 0,
              max: 35,
            },
            {
              name: "Market Intelligence",
              score: progressData.market_intelligence_score || 0,
              max: 20,
            },
            {
              name: "Risk Management",
              score: progressData.risk_management_score || 0,
              max: 15,
            },
            {
              name: "Support Systems",
              score: progressData.support_systems_score || 0,
              max: 10,
            },
          ];

          const strongestDim = dimensions.reduce((a, b) =>
            a.score > b.score ? a : b
          );
          const weakestDim = dimensions.reduce((a, b) =>
            a.score < b.score ? a : b
          );

          // Calculate weighted scores based on original percentages
          // Financial Foundation: 35% (max 35 points)
          // Market Intelligence: 20% (max 20 points)
          // Risk Management: 15% (max 15 points)
          // Support Systems: 10% (max 10 points)
          // Total base: 80%

          const baseScore = dimensions.reduce((sum, dim) => sum + dim.score, 0);

          // Calculate standout bonus: 20% (max 20 points)
          let standoutBonus = 0;
          if (
            assessmentData?.standout_strength_1 &&
            assessmentData?.standout_strength_2
          ) {
            const standoutResult = calculateStandoutScore(
              assessmentData.standout_strength_1,
              assessmentData.standout_strength_2
            );
            // Scale standout score (0-10) to bonus points (0-20)
            standoutBonus = standoutResult.score * 2;
          }

          // Total possible score: 100 points (80 base + 20 standout)
          const totalScore = baseScore + standoutBonus;

          // Calculate success probability with progressive scaling
          let successProbability = 0;

          if (totalScore >= 90) {
            // 90-100 -> 85-95%
            successProbability = 85 + (totalScore - 90);
          } else if (totalScore >= 80) {
            // 80-89 -> 75-84%
            successProbability = 75 + (totalScore - 80) * 0.9;
          } else if (totalScore >= 70) {
            // 70-79 -> 65-74%
            successProbability = 65 + (totalScore - 70) * 0.9;
          } else if (totalScore >= 60) {
            // 60-69 -> 55-64%
            successProbability = 55 + (totalScore - 60) * 0.9;
          } else if (totalScore >= 50) {
            // 50-59 -> 45-54%
            successProbability = 45 + (totalScore - 50) * 0.9;
          } else if (totalScore >= 40) {
            // 40-49 -> 35-44%
            successProbability = 35 + (totalScore - 40) * 0.9;
          } else if (totalScore >= 30) {
            // 30-39 -> 25-34%
            successProbability = 25 + (totalScore - 30) * 0.9;
          } else {
            // Below 30 -> 15-24%
            successProbability = 15 + totalScore * 0.33;
          }

          // Round and cap at 95%
          successProbability = Math.min(Math.round(successProbability), 95);

          setStats({
            successProbability,
            completedAssessments: progressData.assessments_completed || 0,
            strongestDimension: strongestDim.name,
            improvementArea: weakestDim.name,
            lastAssessmentDate: assessmentData?.assessment_date || null,
            standoutStrength1: assessmentData?.standout_strength_1 || null,
            standoutStrength2: assessmentData?.standout_strength_2 || null,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, router, supabase]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getSuccessProbabilityColor = () => {
    const prob = stats?.successProbability || 0;
    if (prob >= 75) return "#10b981"; // green
    if (prob >= 50) return "#3b82f6"; // blue
    if (prob >= 25) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const getProbabilityRange = (probability: number) => {
    if (probability >= 90) return "90-100%";
    if (probability >= 80) return "80-89%";
    if (probability >= 70) return "70-79%";
    if (probability >= 60) return "60-69%";
    if (probability >= 50) return "50-59%";
    if (probability >= 40) return "40-49%";
    if (probability >= 30) return "30-39%";
    return "15-24%";
  };

  const getProbabilityDescription = (probability: number) => {
    if (probability >= 90)
      return "Exceptional - Top tier performance with clear path to success";
    if (probability >= 80)
      return "Excellent - Strong foundation with high growth potential";
    if (probability >= 70)
      return "Very Good - Solid progress with room for optimization";
    if (probability >= 60)
      return "Good - On track with specific areas needing attention";
    if (probability >= 50)
      return "Fair - Making progress but requires strategic improvements";
    if (probability >= 40)
      return "Developing - Building foundation with focused improvement needed";
    if (probability >= 30)
      return "Developing - Building foundation with focused improvement needed";
    return "Early Stage - Significant development needed across multiple areas";
  };

  // Define dimension data with quick wins and long-term goals
  const dimensionsData: DimensionData[] = [
    {
      name: "Financial Foundation",
      score: userProgress?.financial_foundation_score || 0,
      max: 35,
      percentage: Math.round(
        ((userProgress?.financial_foundation_score || 0) / 35) * 100
      ),
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: "green",
      description:
        "Your financial foundation determines your ability to invest in opportunities and weather challenges.",
      quickWins: [
        "Track all expenses for one week",
        "Cancel unused subscriptions",
        "Review insurance policies for better rates",
        "Start emergency fund with $500",
      ],
      longTermGoals: [
        "Build 6-month emergency fund",
        "Improve credit score to 700+",
        "Create business capital fund",
        "Develop passive income streams",
      ],
    },
    {
      name: "Market Intelligence",
      score: userProgress?.market_intelligence_score || 0,
      max: 20,
      percentage: Math.round(
        ((userProgress?.market_intelligence_score || 0) / 20) * 100
      ),
      icon: <Globe className="w-6 h-6 text-white" />,
      color: "blue",
      description:
        "Understanding the market, rates, and customer needs is crucial for making profitable decisions.",
      quickWins: [
        "Calculate your true cost per mile",
        "Research seasonal rate patterns",
        "Build relationships with 3 customers",
        "Join industry forums and groups",
      ],
      longTermGoals: [
        "Develop direct customer relationships",
        "Create rate optimization system",
        "Build market prediction models",
        "Establish industry reputation",
      ],
    },
    {
      name: "Risk Management",
      score: userProgress?.risk_management_score || 0,
      max: 15,
      percentage: Math.round(
        ((userProgress?.risk_management_score || 0) / 15) * 100
      ),
      icon: <Shield className="w-6 h-6 text-white" />,
      color: "orange",
      description:
        "How well you prepare for and manage risks determines your business sustainability.",
      quickWins: [
        "Review and optimize insurance coverage",
        "Create basic contingency plans",
        "Document emergency procedures",
        "Identify top 3 business risks",
      ],
      longTermGoals: [
        "Build comprehensive risk management system",
        "Develop business continuity plan",
        "Create multiple income streams",
        "Establish professional advisory team",
      ],
    },
    {
      name: "Support Systems",
      score: userProgress?.support_systems_score || 0,
      max: 10,
      percentage: Math.round(
        ((userProgress?.support_systems_score || 0) / 10) * 100
      ),
      icon: <Users2 className="w-6 h-6 text-white" />,
      color: "orange",
      description:
        "Your network, family support, and mentorship multiply your individual efforts.",
      quickWins: [
        "Join industry networking groups",
        "Connect with 3 successful operators",
        "Involve family in business planning",
        "Find accountability partner",
      ],
      longTermGoals: [
        "Build extensive professional network",
        "Develop mentor relationships",
        "Create family business culture",
        "Establish industry leadership position",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                Your Assessment Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                {user?.email || "Entrepreneur"}
              </p>
            </div>
            <div>
              <button
                onClick={() =>
                  router.push("/dashboard/comprehensive-assessment")
                }
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ borderRadius: "16px" }}
              >
                <RefreshCw className="w-4 h-4" />
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Probability Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Success Probability Graphic */}
          <div className="lg:w-3/4">
            <div className="bg-gray-900 border-2 border-orange-500 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-gray-400 mb-4 tracking-wider">
                  SUCCESS PROBABILITY
                </h2>

                {/* Large Percentage Display */}
                <div className="mb-3">
                  <span
                    className="text-6xl font-bold"
                    style={{ color: "#ff6b35" }}
                  >
                    {stats?.successProbability || 30}%
                  </span>
                </div>

                {/* Probability Range */}
                <div className="mb-3">
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: "#ff6b35" }}
                  >
                    {getProbabilityRange(stats?.successProbability || 30)}{" "}
                    Probability Range
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">
                  {getProbabilityDescription(stats?.successProbability || 30)}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1 text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    {/* Progress segments */}
                    <div className="absolute inset-0 flex">
                      {/* Orange segment (0-50%) */}
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: "50%" }}
                      />
                      {/* Brown segment (50-75%) */}
                      <div
                        className="h-full bg-amber-700"
                        style={{ width: "25%" }}
                      />
                      {/* Blue segment (75-90%) */}
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: "15%" }}
                      />
                      {/* Green segment (90-100%) */}
                      <div
                        className="h-full bg-green-600"
                        style={{ width: "10%" }}
                      />
                    </div>
                    {/* Progress indicator - white line */}
                    <div
                      className="relative h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${stats?.successProbability || 30}%`,
                        backgroundColor: "#ff7b00",
                      }}
                    />
                    {/* White marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white"
                      style={{ left: `${stats?.successProbability || 30}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* Hidden for now - PDF Download and Progress Update buttons
          <div className="lg:w-1/4 flex flex-col gap-4">
            <PDFDownloadButton
              userProgress={userProgress}
              standoutStrength1={stats?.standoutStrength1 || ""}
              standoutStrength2={stats?.standoutStrength2 || ""}
              className="w-full"
            />

            <button
              onClick={() => router.push("/dashboard/progress")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg w-full flex items-center justify-center gap-2"
              style={{ borderRadius: "16px" }}
            >
              <FileText className="w-4 h-4" />
              Progress Update
            </button>

            <button
              onClick={() => router.push("/dashboard/comprehensive-assessment")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg w-full flex items-center justify-center gap-2"
              style={{ borderRadius: "16px" }}
            >
              <RefreshCw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>
          */}
        </div>

        {/* Standout Strength Profile */}
        {stats?.standoutStrength1 && stats?.standoutStrength2 && (
          <div className="card-dark mb-8">
            <h2 className="section-header">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              Your Standout Strength Profile
            </h2>

            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-gray-100">
                {stats.standoutStrength1} + {stats.standoutStrength2}
              </p>
              <p className="text-gray-400 mt-2">
                {
                  calculateStandoutScore(
                    stats.standoutStrength1,
                    stats.standoutStrength2
                  ).description
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="card-dark-gradient">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Your Strengths
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Motivates drivers during tough times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Creates energy around company vision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>First to spot emerging market trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Creates new revenue streams</span>
                  </li>
                </ul>
              </div>

              {/* Watch Out For */}
              <div className="card-dark-gradient border-orange-500/30">
                <h3 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Watch Out For
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">!</span>
                    <span>May underestimate real challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">!</span>
                    <span>Could burn out from constant high energy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">!</span>
                    <span>May overlook proven traditional methods</span>
                  </li>
                </ul>
              </div>

              {/* How to Leverage */}
              <div className="card-dark-gradient">
                <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  How to Leverage
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">→</span>
                    <span>Combine your strengths for maximum impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">→</span>
                    <span>
                      Channel enthusiasm into driver retention programs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">→</span>
                    <span>Create exciting incentive structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">→</span>
                    <span>Focus on specialized or niche freight markets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Dimension Breakdown */}
        <div className="space-y-6">
          <h2 className="section-header">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Dimension Breakdown
          </h2>

          {dimensionsData.map((dimension) => (
            <div key={dimension.name} className="card-dark">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      dimension.color === "green"
                        ? "bg-green-500"
                        : dimension.color === "blue"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                    }`}
                  >
                    {dimension.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {dimension.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {dimension.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-100">
                    {dimension.score}/{dimension.max}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {dimension.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dimension.color === "green"
                        ? "bg-green-500"
                        : dimension.color === "blue"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                    }`}
                    style={{ width: `${dimension.percentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Wins and Long Term Goals */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quick Wins */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    Quick Wins (This Week)
                  </h4>
                  <ul className="space-y-2">
                    {dimension.quickWins.map((win, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <span className="text-gray-500 mt-0.5">•</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long Term Goals */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    Long Term Goals (3-12 Months)
                  </h4>
                  <ul className="space-y-2">
                    {dimension.longTermGoals.map((goal, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <span className="text-gray-500 mt-0.5">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
