"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp,
  Target,
  Users,
  BarChart3,
  ArrowRight,
  Trophy,
  Lightbulb,
  Calendar,
  CheckCircle,
} from "lucide-react";

interface DashboardStats {
  spiScore: number;
  completedAssessments: number;
  strongestDimension: string;
  improvementArea: string;
  lastAssessmentDate: string | null;
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

        // Fetch user progress
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setUserProgress(progressData);

        // Fetch latest assessment
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
            },
            {
              name: "Market Intelligence",
              score: progressData.market_intelligence_score || 0,
            },
            {
              name: "Personal Strengths",
              score: progressData.personal_strengths_score || 0,
            },
            {
              name: "Risk Management",
              score: progressData.risk_management_score || 0,
            },
            {
              name: "Support Systems",
              score: progressData.support_systems_score || 0,
            },
          ];

          const strongestDim = dimensions.reduce((a, b) =>
            a.score > b.score ? a : b
          );
          const weakestDim = dimensions.reduce((a, b) =>
            a.score < b.score ? a : b
          );

          setStats({
            spiScore: progressData.spi_score || 0,
            completedAssessments: progressData.assessments_completed || 0,
            strongestDimension: strongestDim.name,
            improvementArea: weakestDim.name,
            lastAssessmentDate: assessmentData?.assessment_date || null,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressWidth = (score: number) => `${Math.min(score, 100)}%`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
                ! 👋
              </h1>
              <p className="text-blue-100">
                Your journey to the top 1% continues. Here's your progress
                overview.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/comprehensive-assessment")}
              className="btn-secondary flex items-center gap-2"
            >
              Take Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* SPI Score Card */}
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span
                className={`text-3xl font-bold ${getScoreColor(stats?.spiScore || 0)}`}
              >
                {stats?.spiScore || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">SPI Score</h3>
            <p className="text-gray-600 text-sm">
              Your Strategic Position Index
            </p>
            <div className="mt-3 progress-bar">
              <div
                className="progress-fill"
                style={{ width: getProgressWidth(stats?.spiScore || 0) }}
              />
            </div>
          </div>

          {/* Assessments Completed */}
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats?.completedAssessments || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Assessments</h3>
            <p className="text-gray-600 text-sm">Completed to date</p>
            {stats?.lastAssessmentDate && (
              <p className="text-xs text-gray-500 mt-2">
                Last: {new Date(stats.lastAssessmentDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Strongest Area */}
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Strongest Area</h3>
            <p className="text-gray-900 font-medium">
              {stats?.strongestDimension || "Not yet determined"}
            </p>
            <p className="text-xs text-gray-500 mt-2">Keep building on this!</p>
          </div>

          {/* Improvement Focus */}
          <div className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className="w-8 h-8 text-orange-500" />
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Focus Area</h3>
            <p className="text-gray-900 font-medium">
              {stats?.improvementArea || "Take assessment first"}
            </p>
            <p className="text-xs text-gray-500 mt-2">Room for growth here</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Progress */}
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Your Progress by Dimension
            </h2>

            {userProgress ? (
              <div className="space-y-4">
                {[
                  {
                    name: "Financial Foundation",
                    score: userProgress.financial_foundation_score || 0,
                    icon: "💰",
                    max: 35,
                  },
                  {
                    name: "Market Intelligence",
                    score: userProgress.market_intelligence_score || 0,
                    icon: "📊",
                    max: 20,
                  },
                  {
                    name: "Personal Strengths",
                    score: userProgress.personal_strengths_score || 0,
                    icon: "💪",
                    max: 20,
                  },
                  {
                    name: "Risk Management",
                    score: userProgress.risk_management_score || 0,
                    icon: "🛡️",
                    max: 15,
                  },
                  {
                    name: "Support Systems",
                    score: userProgress.support_systems_score || 0,
                    icon: "🤝",
                    max: 10,
                  },
                ].map((dimension) => (
                  <div key={dimension.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dimension.icon}</span>
                        <span className="font-medium">{dimension.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {dimension.score}/{dimension.max} points
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(dimension.score / dimension.max) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No assessment data yet</p>
                <button
                  onClick={() =>
                    router.push("/dashboard/comprehensive-assessment")
                  }
                  className="btn-primary mt-4"
                >
                  Take Your First Assessment
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Next Steps Card */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Next Steps
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    {stats?.completedAssessments === 0
                      ? "Complete your first comprehensive assessment"
                      : "Review your latest assessment results"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    Focus on improving your{" "}
                    {stats?.improvementArea || "weakest dimension"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    Connect with the community for support
                  </p>
                </div>
              </div>
            </div>

            {/* Resources Card */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    router.push("/dashboard/comprehensive-assessment/results")
                  }
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>View Results</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  onClick={() => router.push("/dashboard/insights")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Insights & Tips</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  onClick={() => router.push("/dashboard/community")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>Community</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
