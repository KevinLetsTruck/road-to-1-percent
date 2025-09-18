"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, CheckCircle } from "lucide-react";

const assessmentWeights = {
  spi: 0.3,
  industry: 0.2,
  leadership: 0.15,
  standout: 0.1, // standout_score (0-10, multiply by 10)
  customer: 0.1,
  operational: 0.1,
  health: 0.05,
};

function getCategory(score: number) {
  if (score >= 85)
    return {
      label: "Ready to Launch",
      color: "green",
      desc: "You have the skills, knowledge, and financial foundation to start now. Focus on execution, networking, and scaling.",
    };
  if (score >= 70)
    return {
      label: "Almost Ready",
      color: "yellow",
      desc: "You’re close! Address a few gaps, then launch in 3–6 months.",
    };
  if (score >= 55)
    return {
      label: "Needs Preparation",
      color: "orange",
      desc: "Several key areas need work. Plan for 6–12 months of focused improvement.",
    };
  return {
    label: "Not Ready Yet",
    color: "red",
    desc: "Foundational issues must be fixed. Plan for 12–18 months of preparation and support.",
  };
}

function getActionPlan(scores: Record<string, number>) {
  // Find lowest 2 areas
  const areas = [
    { key: "spi", label: "Financial Health", score: scores.spi },
    { key: "industry", label: "Industry Knowledge", score: scores.industry },
    { key: "leadership", label: "Leadership", score: scores.leadership },
    {
      key: "standout",
      label: "Entrepreneurial Fit",
      score: scores.standout * 10,
    },
    { key: "customer", label: "Customer Service", score: scores.customer },
    {
      key: "operational",
      label: "Operational Efficiency",
      score: scores.operational,
    },
    { key: "health", label: "Health & Wellness", score: scores.health },
  ];
  areas.sort((a, b) => a.score - b.score);
  const focusAreas = areas.slice(0, 2);
  const plans: Record<
    string,
    { goal: string; actions: string[]; timeline: string }
  > = {
    spi: {
      goal: "Strengthen your financial foundation",
      actions: [
        "Build an emergency fund (3–6 months expenses)",
        "Reduce high-interest debt",
        "Track all business and personal expenses",
        "Create a monthly budget and stick to it",
      ],
      timeline: "3–12 months",
    },
    industry: {
      goal: "Deepen your trucking business knowledge",
      actions: [
        "Study rates, lanes, and seasonality",
        "Learn about direct customers vs. brokers",
        "Follow industry news and trends",
        "Network with experienced carriers",
      ],
      timeline: "2–6 months",
    },
    leadership: {
      goal: "Grow your leadership and relationship skills",
      actions: [
        "Find a mentor or business coach",
        "Practice negotiation and conflict resolution",
        "Build strong relationships with vendors and partners",
      ],
      timeline: "2–6 months",
    },
    standout: {
      goal: "Leverage your unique strengths",
      actions: [
        "Review your Standout roles and how they fit entrepreneurship",
        "Seek opportunities that match your strengths",
        "Address any gaps with learning or partnerships",
      ],
      timeline: "Ongoing",
    },
    customer: {
      goal: "Deliver excellent customer service",
      actions: [
        "Communicate clearly and promptly with shippers/brokers",
        "Follow up after deliveries",
        "Ask for feedback and referrals",
      ],
      timeline: "1–3 months",
    },
    operational: {
      goal: "Boost operational efficiency",
      actions: [
        "Review your cost structure and cut waste",
        "Use technology to track loads and expenses",
        "Plan routes for maximum profit",
      ],
      timeline: "2–6 months",
    },
    health: {
      goal: "Prioritize your health and wellness",
      actions: [
        "Schedule regular checkups",
        "Plan healthy meals and exercise",
        "Manage stress with downtime and support",
      ],
      timeline: "Ongoing",
    },
  };
  return focusAreas.map((area) => ({
    label: area.label,
    goal: plans[area.key].goal,
    actions: plans[area.key].actions,
    timeline: plans[area.key].timeline,
    score: area.score,
  }));
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [category, setCategory] = useState<{
    label: string;
    color: string;
    desc: string;
  } | null>(null);
  const [actionPlan, setActionPlan] = useState<
    Array<{
      label: string;
      goal: string;
      actions: string[];
      timeline: string;
      score: number;
    }>
  >([]);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchScores = async () => {
      // Check if this is an admin view
      const urlParams = new URLSearchParams(window.location.search);
      const adminParam = urlParams.get("admin");
      const userIdParam = urlParams.get("userId");
      const isAdmin = adminParam === "true";
      setIsAdminView(isAdmin);

      let targetUserId = userIdParam;

      // If not admin view or no userId specified, use current user
      if (!isAdmin || !userIdParam) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        targetUserId = user.id;
      }

      // Fetch user profile for display
      if (!targetUserId) {
        console.error("No target user ID available");
        return;
      }

      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", targetUserId)
        .single();

      if (profile) {
        setUserInfo({
          name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          email: profile.email,
        });
      }

      const { data: progress, error: progressError } = await (supabase as any)
        .from("user_progress")
        .select("*")
        .eq("user_id", targetUserId)
        .maybeSingle();

      console.log("Progress query result:", { progress, progressError });

      if (!progress) {
        console.log("No progress data found for user:", targetUserId);
        setLoading(false);
        return;
      }
      // Debug: Log the progress data to see what we're getting
      console.log("Progress data:", progress);

      // Normalize scores - use the correct field names from the database
      const scores = {
        spi: progress.spi_score ?? 0,
        industry: progress.industry_knowledge_score ?? 0,
        leadership: progress.leadership_score ?? 0,
        standout: progress.standout_score ?? 0,
        customer: progress.customer_service_score ?? 0,
        operational: progress.operational_score ?? 0,
        health: progress.health_score ?? 0,
      };

      // Debug: Log the normalized scores
      console.log("Normalized scores:", scores);
      // Weighted score
      const overall =
        scores.spi * assessmentWeights.spi +
        scores.industry * assessmentWeights.industry +
        scores.leadership * assessmentWeights.leadership +
        scores.standout * 10 * assessmentWeights.standout +
        scores.customer * assessmentWeights.customer +
        scores.operational * assessmentWeights.operational +
        scores.health * assessmentWeights.health;
      setScores({ ...scores, overall: Math.round(overall) });
      setCategory(getCategory(overall));
      setActionPlan(getActionPlan(scores));
      setLoading(false);
    };
    fetchScores();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your results...</div>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          No assessment data found. Please complete your assessments first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600 mr-2" />
              <div>
                <span className="text-xl font-bold text-gray-900">
                  {isAdminView ? "Client Results" : "Results & Recommendations"}
                </span>
                {isAdminView && userInfo && (
                  <div className="text-sm text-gray-600">
                    Viewing results for: {userInfo.name} ({userInfo.email})
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                router.push(
                  isAdminView ? "/admin/view-assessment" : "/dashboard"
                )
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
            >
              {isAdminView ? "Back to Admin" : "Back to Dashboard"}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isAdminView ? "Client" : "Your"} Overall Score:{" "}
            <span
              className={
                category?.color === "green"
                  ? "text-green-600"
                  : category?.color === "yellow"
                    ? "text-yellow-600"
                    : category?.color === "orange"
                      ? "text-orange-600"
                      : "text-red-600"
              }
            >
              {scores.overall}
            </span>
          </h1>
          <div
            className={
              category?.color === "green"
                ? "text-lg font-semibold mb-2 text-green-700"
                : category?.color === "yellow"
                  ? "text-lg font-semibold mb-2 text-yellow-700"
                  : category?.color === "orange"
                    ? "text-lg font-semibold mb-2 text-orange-700"
                    : "text-lg font-semibold mb-2 text-red-700"
            }
          >
            {category?.label}
          </div>
          <div className="mb-4 text-gray-700">{category?.desc}</div>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Financial (SPI)
              </div>
              <div className="text-2xl font-bold">{scores.spi}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Industry Knowledge
              </div>
              <div className="text-2xl font-bold">{scores.industry}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">Leadership</div>
              <div className="text-2xl font-bold">{scores.leadership}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Standout Fit
              </div>
              <div className="text-2xl font-bold">{scores.standout * 10}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Customer Service
              </div>
              <div className="text-2xl font-bold">{scores.customer}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Operational
              </div>
              <div className="text-2xl font-bold">{scores.operational}</div>
            </div>
            <div className="bg-gray-100 rounded p-4 flex-1 min-w-[180px]">
              <div className="font-semibold text-gray-700 mb-1">
                Health & Wellness
              </div>
              <div className="text-2xl font-bold">{scores.health}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {isAdminView ? "Client" : "Your"} Personalized Action Plan
          </h2>
          {actionPlan.map((area, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-semibold text-gray-900">
                  {area.label}
                </span>
                <span className="ml-4 text-gray-500">Score: {area.score}</span>
              </div>
              <div className="mb-1 font-semibold">
                Goal: <span className="text-gray-700">{area.goal}</span>
              </div>
              <div className="mb-1">
                Timeline: <span className="text-gray-700">{area.timeline}</span>
              </div>
              <ul className="list-disc ml-8 text-gray-700">
                {area.actions.map((action: string, i: number) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm">
          Remember: Progress is a journey. Use your action plan, track your
          improvements, and revisit your assessments as you grow!
        </div>
      </main>
    </div>
  );
}
