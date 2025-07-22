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
  Activity,
  Shield,
  AlertTriangle,
  Zap,
  DollarSign,
  Globe,
  Users2,
  Check,
} from "lucide-react";

interface DashboardStats {
  spiScore: number;
  completedAssessments: number;
  strongestDimension: string;
  improvementArea: string;
  lastAssessmentDate: string | null;
  successProbability: number;
  tier: string;
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

          const spiScore = progressData.spi_score || 0;
          let tier = "Building Foundation";
          let successProb = 30;

          if (spiScore >= 80) {
            tier = "Top 10%";
            successProb = 75;
          } else if (spiScore >= 60) {
            tier = "Scaling Up";
            successProb = 60;
          } else if (spiScore >= 40) {
            tier = "Developing";
            successProb = 45;
          }

          setStats({
            spiScore,
            completedAssessments: progressData.assessments_completed || 0,
            strongestDimension: strongestDim.name,
            improvementArea: weakestDim.name,
            lastAssessmentDate: assessmentData?.assessment_date || null,
            successProbability: successProb,
            tier,
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  const getProgressWidth = (score: number) => `${Math.min(score, 100)}%`;

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
                Your SPI Assessment Results
              </h1>
              <p className="text-gray-400 mt-1">
                {user?.email || "Entrepreneur"}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/comprehensive-assessment")}
              className="btn-secondary flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* SPI Score Card */}
          <div className="card-dark-gradient">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  SPI Total Score
                </p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-6xl font-bold text-gray-100">
                    {stats?.spiScore || 0}
                  </span>
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                <p className="text-gray-400 mt-2">
                  Assessment Score:{" "}
                  {Math.round(((stats?.spiScore || 0) * 34) / 100)}/80
                </p>
                <p className="text-gray-400">Standout Bonus: +6/20</p>
              </div>
              <div className="icon-container bg-purple-500/20">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">
                  Tier: {stats?.tier || "Building Foundation"}
                </span>
                <span className="text-gray-400">Bottom 90%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: getProgressWidth(stats?.spiScore || 0) }}
                />
              </div>
            </div>
          </div>

          {/* Success Probability Card */}
          <div className="card-orange-gradient relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Target className="w-20 h-20 text-white/10" />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm uppercase tracking-wide">
                Success Probability
              </p>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-6xl font-bold">
                  {stats?.successProbability || 30}%
                </span>
              </div>
              <p className="text-white/80 mt-4 text-sm">
                30-49% Probability Range
              </p>
              <p className="text-white/90 mt-2">
                Developing - Building foundation with focused improvement needed
              </p>
              <div className="mt-4">
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-white/80 rounded-full"
                    style={{ width: `${stats?.successProbability || 30}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-white/60">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standout Strength Profile */}
        <div className="card-dark mb-8">
          <h2 className="section-header">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Your Standout Strength Profile
          </h2>

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
                  <span>
                    Combine Stimulator and Pioneer strengths for maximum impact
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">→</span>
                  <span>Channel enthusiasm into driver retention programs</span>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button
            onClick={() =>
              router.push("/dashboard/comprehensive-assessment/results")
            }
            className="card-dark hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-100">
                  View Detailed Results
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  See your complete analysis
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/insights")}
            className="card-dark hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-100">Get Insights</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Personalized recommendations
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/community")}
            className="card-dark hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-100">Join Community</h3>
                <p className="text-gray-400 text-sm mt-1">Connect with peers</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
