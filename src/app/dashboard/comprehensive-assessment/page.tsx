"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Brain,
  Shield,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Calculator,
  Save,
} from "lucide-react";
import { calculateStandoutScore } from "@/lib/standoutScoring";
import CalculatorModal from "@/components/CalculatorModal";
import NetWorthCalculator from "@/components/calculators/NetWorthCalculator";
import MonthlySavingsCalculator from "@/components/calculators/MonthlySavingsCalculator";

type CurrentSituation =
  | "Employee Driver"
  | "Carrier Authority"
  | "Leased O/O"
  | "Small Fleet";

interface ComprehensiveAssessmentData {
  // Current Situation
  current_situation: CurrentSituation;

  // Contextual Questions (for specific situations)
  fleet_size: number | string; // For Small Fleet
  load_sources: string[]; // For Carrier Authority and Small Fleet

  // Standout Assessment Results
  standout_strength_1: string;
  standout_strength_2: string;

  // Financial Foundation (35 points)
  net_worth: number;
  monthly_savings: number;
  emergency_fund_months: number;
  debt_to_income_ratio: number;
  business_capital: number;
  credit_score: number;

  // Market Intelligence (20 points)
  rate_understanding: number;
  cost_analysis: number;
  customer_knowledge: number;
  industry_trends: number;
  strategic_planning: number;

  // Personal Strengths (20 points)

  // Risk Management (15 points)
  contingency_planning: number;
  business_continuity: number;
  risk_assessment: number;

  // Support Systems (10 points)
  family_alignment: number;
  professional_network: number;
  mentorship: number;
  industry_reputation: number;
}

interface AssessmentQuestion {
  id: string;
  dimension: string;
  question: string;
  options: { value: number; label: string; description?: string }[];
  weight: number;
  maxPoints: number;
}

const getAssessmentQuestions = (
  currentSituation: CurrentSituation
): AssessmentQuestion[] => [
  // Financial Foundation Questions
  {
    id: "net_worth",
    dimension: "Financial Foundation",
    question:
      currentSituation === "Employee Driver"
        ? "What is your current net worth (assets minus liabilities)?"
        : "What is your current net worth (assets minus liabilities)?",
    options: [
      {
        value: -1,
        label: "🧮 Open Net Worth Calculator",
        description: "Calculate assets minus liabilities for precise value",
      },
      {
        value: 0,
        label: "Negative $25,000+",
        description: "Significant debt burden",
      },
      {
        value: 3,
        label: "Negative $10,000 to $25,000",
        description: "Moderate debt",
      },
      { value: 6, label: "Negative $10,000 to $0", description: "Minor debt" },
      { value: 10, label: "$0 to $10,000", description: "Breaking even" },
      {
        value: 12,
        label: "$10,000 to $50,000",
        description: "Positive foundation",
      },
      { value: 14, label: "$50,000+", description: "Strong financial base" },
    ],
    weight: 0.4,
    maxPoints: 14,
  },
  {
    id: "monthly_savings",
    dimension: "Financial Foundation",
    question: "How much do you save monthly after all expenses?",
    options: [
      {
        value: -1,
        label: "💰 Open Monthly Savings Calculator",
        description: "Calculate income minus expenses for precise value",
      },
      {
        value: 0,
        label: "Negative (spending more than earning)",
        description: "Living beyond means",
      },
      { value: 4, label: "$0 to $500", description: "Breaking even" },
      { value: 7, label: "$500 to $1,000", description: "Moderate savings" },
      { value: 9, label: "$1,000 to $2,000", description: "Good savings rate" },
      { value: 10.5, label: "$2,000+", description: "Excellent savings" },
    ],
    weight: 0.3,
    maxPoints: 10.5,
  },
  {
    id: "emergency_fund_months",
    dimension: "Financial Foundation",
    question:
      "How many months of expenses do you have saved in emergency funds?",
    options: [
      { value: 0, label: "0 months", description: "No emergency fund" },
      {
        value: 0.5,
        label: "Less than 1 month",
        description: "Minimal protection",
      },
      { value: 3, label: "1-3 months", description: "Basic protection" },
      { value: 5, label: "3-6 months", description: "Good protection" },
      { value: 7, label: "6+ months", description: "Excellent protection" },
    ],
    weight: 0.2,
    maxPoints: 7,
  },
  {
    id: "credit_score",
    dimension: "Financial Foundation",
    question: "What is your current credit score?",
    options: [
      { value: 0, label: "Below 500", description: "Poor credit" },
      { value: 0.5, label: "500-580", description: "Fair credit" },
      { value: 1.5, label: "580-670", description: "Average credit" },
      { value: 2.5, label: "670-740", description: "Good credit" },
      { value: 3.5, label: "740+", description: "Excellent credit" },
    ],
    weight: 0.1,
    maxPoints: 3.5,
  },

  // Market Intelligence Questions
  {
    id: "rate_understanding",
    dimension: "Market Intelligence",
    question:
      currentSituation === "Employee Driver"
        ? "How do you evaluate job opportunities and compensation?"
        : "How do you evaluate freight rates?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I accept whatever job is offered",
              description: "No evaluation",
            },
            {
              value: 1,
              label: "I look at the hourly rate or salary",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I compare pay to my living expenses",
              description: "Cost-conscious",
            },
            {
              value: 3,
              label: "I analyze benefits, hours, and work conditions",
              description: "Strategic thinking",
            },
            {
              value: 4,
              label: "I evaluate career growth and long-term opportunities",
              description: "Career intelligence",
            },
          ]
        : [
            {
              value: 0,
              label: "I accept whatever rate is offered",
              description: "No evaluation",
            },
            {
              value: 1,
              label: "I look at total pay for the run",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I compare rate per mile to my costs",
              description: "Cost-conscious",
            },
            {
              value: 3,
              label: "I analyze deadhead, loading time, fuel costs",
              description: "Strategic thinking",
            },
            {
              value: 4,
              label: "I evaluate seasonal patterns and market trends",
              description: "Market intelligence",
            },
          ],
    weight: 0.2,
    maxPoints: 4,
  },
  {
    id: "cost_analysis",
    dimension: "Market Intelligence",
    question:
      currentSituation === "Employee Driver"
        ? "How well do you understand your personal cost of living and expenses?"
        : "How well do you understand your cost per mile?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I don't track my expenses",
              description: "No awareness",
            },
            {
              value: 1,
              label: "I know my basic bills",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I track major expenses",
              description: "Partial tracking",
            },
            {
              value: 3,
              label: "I calculate my cost of living",
              description: "Full cost analysis",
            },
            {
              value: 4,
              label: "I optimize my spending based on analysis",
              description: "Strategic optimization",
            },
          ]
        : [
            {
              value: 0,
              label: "I don't track costs",
              description: "No awareness",
            },
            {
              value: 1,
              label: "I know fuel and truck payment",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I track major expenses",
              description: "Partial tracking",
            },
            {
              value: 3,
              label: "I calculate total cost per mile",
              description: "Full cost analysis",
            },
            {
              value: 4,
              label: "I optimize routes based on cost analysis",
              description: "Strategic optimization",
            },
          ],
    weight: 0.2,
    maxPoints: 4,
  },
  {
    id: "customer_knowledge",
    dimension: "Market Intelligence",
    question:
      currentSituation === "Employee Driver"
        ? "How well do you understand your employer's business and expectations?"
        : "How well do you understand your customers and their needs?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I don't understand the business",
              description: "No awareness",
            },
            {
              value: 1,
              label: "I know basic job requirements",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I understand delivery expectations",
              description: "Service awareness",
            },
            {
              value: 3,
              label: "I know company policies and procedures",
              description: "Business understanding",
            },
            {
              value: 4,
              label: "I understand company goals and contribute to success",
              description: "Strategic partnership",
            },
          ]
        : [
            {
              value: 0,
              label: "I don't know my customers",
              description: "No relationship",
            },
            {
              value: 1,
              label: "I know customer names and locations",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I understand delivery requirements",
              description: "Service awareness",
            },
            {
              value: 3,
              label: "I know customer business cycles",
              description: "Business understanding",
            },
            {
              value: 4,
              label:
                "I have direct relationships and understand their challenges",
              description: "Strategic partnership",
            },
          ],
    weight: 0.2,
    maxPoints: 4,
  },
  {
    id: "industry_trends",
    dimension: "Market Intelligence",
    question:
      currentSituation === "Employee Driver"
        ? "How well do you understand industry trends and job market conditions?"
        : "How well do you understand industry trends and seasonal patterns?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I don't follow industry news",
              description: "No awareness",
            },
            {
              value: 1,
              label: "I notice when job opportunities change",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I understand some industry patterns",
              description: "Partial understanding",
            },
            {
              value: 3,
              label: "I track factors affecting job market",
              description: "Comprehensive tracking",
            },
            {
              value: 4,
              label: "I can predict job market changes based on trends",
              description: "Predictive analysis",
            },
          ]
        : [
            {
              value: 0,
              label: "I don't follow trends",
              description: "No awareness",
            },
            {
              value: 1,
              label: "I notice when rates change",
              description: "Basic awareness",
            },
            {
              value: 2,
              label: "I understand some seasonal patterns",
              description: "Partial understanding",
            },
            {
              value: 3,
              label: "I track multiple factors affecting rates",
              description: "Comprehensive tracking",
            },
            {
              value: 4,
              label: "I can predict rate changes based on trends",
              description: "Predictive analysis",
            },
          ],
    weight: 0.2,
    maxPoints: 4,
  },
  {
    id: "strategic_planning",
    dimension: "Market Intelligence",
    question:
      currentSituation === "Employee Driver"
        ? "How do you approach career planning and professional development?"
        : "How do you approach strategic planning for your business?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I don't plan my career",
              description: "No planning",
            },
            {
              value: 1,
              label: "I think about next week",
              description: "Short-term thinking",
            },
            {
              value: 2,
              label: "I plan for next month",
              description: "Monthly planning",
            },
            {
              value: 3,
              label: "I have quarterly career goals",
              description: "Quarterly planning",
            },
            {
              value: 4,
              label: "I have annual career plans and long-term strategy",
              description: "Strategic planning",
            },
          ]
        : [
            {
              value: 0,
              label: "I don't plan ahead",
              description: "No planning",
            },
            {
              value: 1,
              label: "I think about next week",
              description: "Short-term thinking",
            },
            {
              value: 2,
              label: "I plan for next month",
              description: "Monthly planning",
            },
            {
              value: 3,
              label: "I have quarterly goals",
              description: "Quarterly planning",
            },
            {
              value: 4,
              label: "I have annual business plans and long-term strategy",
              description: "Strategic planning",
            },
          ],
    weight: 0.2,
    maxPoints: 4,
  },

  // Risk Management Questions
  {
    id: "contingency_planning",
    dimension: "Risk Management",
    question:
      currentSituation === "Employee Driver"
        ? "How many months of expenses could you cover if you lost your job?"
        : "How many months of expenses could you cover if your truck was down?",
    options:
      currentSituation === "Employee Driver"
        ? [
            { value: 0, label: "0 months", description: "No contingency" },
            { value: 1, label: "1 month", description: "Minimal protection" },
            { value: 2, label: "2-3 months", description: "Basic protection" },
            { value: 3, label: "3-6 months", description: "Good protection" },
            {
              value: 4,
              label: "6+ months",
              description: "Excellent protection",
            },
            {
              value: 5,
              label: "12+ months",
              description: "Outstanding protection",
            },
          ]
        : [
            { value: 0, label: "0 months", description: "No contingency" },
            { value: 1, label: "1 month", description: "Minimal protection" },
            { value: 2, label: "2-3 months", description: "Basic protection" },
            { value: 3, label: "3-6 months", description: "Good protection" },
            {
              value: 4,
              label: "6+ months",
              description: "Excellent protection",
            },
            {
              value: 5,
              label: "12+ months",
              description: "Outstanding protection",
            },
          ],
    weight: 0.33,
    maxPoints: 5,
  },

  {
    id: "business_continuity",
    dimension: "Risk Management",
    question:
      currentSituation === "Employee Driver"
        ? "What's your plan if you were injured and couldn't work?"
        : "What's your plan if you were injured and couldn't drive?",
    options:
      currentSituation === "Employee Driver"
        ? [
            { value: 0, label: "No plan", description: "No preparation" },
            {
              value: 0.5,
              label: "Hope for the best",
              description: "Wishful thinking",
            },
            {
              value: 1,
              label: "Rely on family support",
              description: "Dependent",
            },
            {
              value: 2,
              label: "Use savings temporarily",
              description: "Basic preparation",
            },
            {
              value: 3,
              label: "Have disability insurance and backup plans",
              description: "Comprehensive preparation",
            },
          ]
        : [
            { value: 0, label: "No plan", description: "No preparation" },
            {
              value: 0.5,
              label: "Hope for the best",
              description: "Wishful thinking",
            },
            {
              value: 1,
              label: "Rely on family support",
              description: "Dependent",
            },
            {
              value: 2,
              label: "Use savings temporarily",
              description: "Basic preparation",
            },
            {
              value: 3,
              label: "Have disability insurance and backup plans",
              description: "Comprehensive preparation",
            },
          ],
    weight: 0.2,
    maxPoints: 3,
  },
  {
    id: "risk_assessment",
    dimension: "Risk Management",
    question:
      currentSituation === "Employee Driver"
        ? "How do you evaluate and mitigate personal and career risks?"
        : "How do you evaluate and mitigate business risks?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "I don't think about risks",
              description: "No awareness",
            },
            {
              value: 0.5,
              label: "I worry about risks but don't plan",
              description: "Anxious",
            },
            {
              value: 1,
              label: "I avoid obvious risks",
              description: "Cautious",
            },
            {
              value: 2,
              label: "I have basic safety measures",
              description: "Basic preparation",
            },
            {
              value: 3,
              label: "I systematically assess and mitigate risks",
              description: "Strategic",
            },
            {
              value: 4,
              label: "I have comprehensive risk management systems",
              description: "Expert",
            },
          ]
        : [
            {
              value: 0,
              label: "I don't think about risks",
              description: "No awareness",
            },
            {
              value: 0.5,
              label: "I worry about risks but don't plan",
              description: "Anxious",
            },
            {
              value: 1,
              label: "I avoid obvious risks",
              description: "Cautious",
            },
            {
              value: 2,
              label: "I have basic safety measures",
              description: "Basic preparation",
            },
            {
              value: 3,
              label: "I systematically assess and mitigate risks",
              description: "Strategic",
            },
            {
              value: 4,
              label: "I have comprehensive risk management systems",
              description: "Expert",
            },
          ],
    weight: 0.27,
    maxPoints: 4,
  },

  // Support Systems Questions
  {
    id: "family_alignment",
    dimension: "Support Systems",
    question:
      currentSituation === "Employee Driver"
        ? "How well does your family understand and support your career goals?"
        : "How well does your family understand and support your business goals?",
    options:
      currentSituation === "Employee Driver"
        ? [
            {
              value: 0,
              label: "Family opposes my goals",
              description: "Active resistance",
            },
            {
              value: 0.5,
              label: "Family is indifferent",
              description: "No support",
            },
            {
              value: 1,
              label: "Family is supportive but uninvolved",
              description: "Passive support",
            },
            {
              value: 2,
              label: "Family understands and encourages",
              description: "Active support",
            },
            {
              value: 3,
              label: "Family is actively involved in planning",
              description: "Partnership",
            },
          ]
        : [
            {
              value: 0,
              label: "Family opposes my goals",
              description: "Active resistance",
            },
            {
              value: 0.5,
              label: "Family is indifferent",
              description: "No support",
            },
            {
              value: 1,
              label: "Family is supportive but uninvolved",
              description: "Passive support",
            },
            {
              value: 2,
              label: "Family understands and encourages",
              description: "Active support",
            },
            {
              value: 3,
              label: "Family is actively involved in planning",
              description: "Partnership",
            },
          ],
    weight: 0.3,
    maxPoints: 3,
  },
  {
    id: "professional_network",
    dimension: "Support Systems",
    question:
      "How strong is your professional network in the trucking industry?",
    options: [
      { value: 0, label: "No professional contacts", description: "Isolated" },
      {
        value: 0.5,
        label: "A few casual acquaintances",
        description: "Minimal network",
      },
      {
        value: 1,
        label: "Some industry contacts",
        description: "Basic network",
      },
      {
        value: 2,
        label: "Strong relationships with other drivers",
        description: "Good network",
      },
      {
        value: 3,
        label: "Extensive network including mentors and industry leaders",
        description: "Excellent network",
      },
    ],
    weight: 0.3,
    maxPoints: 3,
  },
  {
    id: "mentorship",
    dimension: "Support Systems",
    question: "Do you have mentors or advisors in the industry?",
    options: [
      { value: 0, label: "No mentors", description: "No guidance" },
      {
        value: 0.5,
        label: "Informal advice from experienced drivers",
        description: "Casual guidance",
      },
      {
        value: 1,
        label: "One formal mentor",
        description: "Structured guidance",
      },
      {
        value: 1.5,
        label: "Multiple mentors and advisors",
        description: "Comprehensive guidance",
      },
      {
        value: 2,
        label: "Professional coaching and advisory team",
        description: "Expert guidance",
      },
    ],
    weight: 0.2,
    maxPoints: 2,
  },
  {
    id: "industry_reputation",
    dimension: "Support Systems",
    question: "How would you describe your reputation in the driver community?",
    options: [
      {
        value: 0,
        label: "Unknown or negative reputation",
        description: "Poor standing",
      },
      {
        value: 0.5,
        label: "Neutral reputation",
        description: "Average standing",
      },
      {
        value: 1,
        label: "Generally positive reputation",
        description: "Good standing",
      },
      {
        value: 1.5,
        label: "Well-respected in the community",
        description: "Strong standing",
      },
      {
        value: 2,
        label: "Recognized as a leader and resource",
        description: "Excellent standing",
      },
    ],
    weight: 0.2,
    maxPoints: 2,
  },
];

export default function ComprehensiveAssessmentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<ComprehensiveAssessmentData>({
    current_situation: "Employee Driver",
    fleet_size: 0,
    load_sources: [],
    standout_strength_1: "",
    standout_strength_2: "",
    net_worth: 0,
    monthly_savings: 0,
    emergency_fund_months: 0,
    debt_to_income_ratio: 0,
    business_capital: 0,
    credit_score: 0,
    rate_understanding: 0,
    cost_analysis: 0,
    customer_knowledge: 0,
    industry_trends: 0,
    strategic_planning: 0,

    contingency_planning: 0,
    business_continuity: 0,
    risk_assessment: 0,
    family_alignment: 0,
    professional_network: 0,
    mentorship: 0,
    industry_reputation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showNetWorthCalculator, setShowNetWorthCalculator] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [calculatorResults, setCalculatorResults] = useState<{
    netWorth?: number;
    monthlySavings?: number;
  }>({});
  const [hasExistingData, setHasExistingData] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Load existing assessment data if available
      try {
        const { data: existingAssessment } = await supabase
          .from("comprehensive_assessments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (existingAssessment) {
          // Load the existing data into the form for updating
          setFormData({
            current_situation:
              existingAssessment.current_situation || "Employee Driver",
            fleet_size: existingAssessment.fleet_size || 0,
            load_sources: existingAssessment.load_sources || [],
            standout_strength_1: existingAssessment.standout_strength_1 || "",
            standout_strength_2: existingAssessment.standout_strength_2 || "",
            net_worth: existingAssessment.net_worth || 0,
            monthly_savings: existingAssessment.monthly_savings || 0,
            emergency_fund_months:
              existingAssessment.emergency_fund_months || 0,
            debt_to_income_ratio: existingAssessment.debt_to_income_ratio || 0,
            business_capital: existingAssessment.business_capital || 0,
            credit_score: existingAssessment.credit_score || 0,
            rate_understanding: existingAssessment.rate_understanding || 0,
            cost_analysis: existingAssessment.cost_analysis || 0,
            customer_knowledge: existingAssessment.customer_knowledge || 0,
            industry_trends: existingAssessment.industry_trends || 0,
            strategic_planning: existingAssessment.strategic_planning || 0,

            contingency_planning: existingAssessment.contingency_planning || 0,
            business_continuity: existingAssessment.business_continuity || 0,
            risk_assessment: existingAssessment.risk_assessment || 0,
            family_alignment: existingAssessment.family_alignment || 0,
            professional_network: existingAssessment.professional_network || 0,
            mentorship: existingAssessment.mentorship || 0,
            industry_reputation: existingAssessment.industry_reputation || 0,
          });
          setHasExistingData(true);
        }
      } catch (error) {
        console.log("No existing assessment found, starting fresh");
      }

      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  const calculateDimensionScore = (dimension: string) => {
    const assessmentQuestions = getAssessmentQuestions(
      formData.current_situation
    );
    const dimensionQuestions = assessmentQuestions.filter(
      (q) => q.dimension === dimension
    );
    let totalScore = 0;

    dimensionQuestions.forEach((question) => {
      const value = formData[
        question.id as keyof ComprehensiveAssessmentData
      ] as number;
      totalScore += value;
    });

    return Math.round(totalScore);
  };

  const calculateTotalSPIScore = () => {
    const financialScore = calculateDimensionScore("Financial Foundation");
    const marketScore = calculateDimensionScore("Market Intelligence");
    const riskScore = calculateDimensionScore("Risk Management");
    const supportScore = calculateDimensionScore("Support Systems");

    // Calculate base score from 4 dimensions (out of 90)
    // Financial: 35, Market: 20, Risk: 15, Support: 10 = 80 points
    const baseScore = financialScore + marketScore + riskScore + supportScore;

    // Add standout strength bonus (up to 10 points)
    const standoutBonus = calculateStandoutScore(
      formData.standout_strength_1,
      formData.standout_strength_2
    ).score;

    // Scale to ensure max is 100
    // Base (80) + Standout (10) = 90, so we scale by 100/90
    const scaledScore = Math.round((baseScore + standoutBonus) * (100 / 90));

    // Ensure score doesn't exceed 100
    return Math.min(scaledScore, 100);
  };

  const getSPITier = (score: number) => {
    if (score >= 85) return "1%"; // Top 1% - Exceptional performers
    if (score >= 70) return "9%"; // Top 9% - High performers
    return "90%"; // Bottom 90% - Building foundation
  };

  const getStrengthCombination = () => {
    const strength1 = formData.standout_strength_1;
    const strength2 = formData.standout_strength_2;

    if (strength1 && strength2) {
      // Sort alphabetically for consistent combination naming
      const strengths = [strength1, strength2].sort();
      return `${strengths[0]} + ${strengths[1]}`;
    } else if (strength1) {
      return strength1;
    } else if (strength2) {
      return strength2;
    }
    return "Balanced";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!user) throw new Error("User not authenticated");

      const totalScore = calculateTotalSPIScore();
      const tier = getSPITier(totalScore);
      const strengthCombo = getStrengthCombination();

      // Calculate dimension scores
      const dimensionScores = {
        financial_foundation: calculateDimensionScore("Financial Foundation"),
        market_intelligence: calculateDimensionScore("Market Intelligence"),
        risk_management: calculateDimensionScore("Risk Management"),
        support_systems: calculateDimensionScore("Support Systems"),
      };

      // Calculate standout bonus
      const standoutBonus = Math.round(
        calculateStandoutScore(
          formData.standout_strength_1,
          formData.standout_strength_2
        ).score * 2
      );

      // Get next version number
      const { data: versionData, error: versionError } = await supabase.rpc(
        "get_next_version_number",
        { p_user_id: user.id }
      );

      if (versionError) throw versionError;
      const versionNumber = versionData || 1;

      // Save to assessment history
      const { error: historyError } = await supabase
        .from("assessment_history")
        .insert({
          user_id: user.id,
          assessment_data: formData,
          total_spi_score: totalScore,
          financial_foundation_score: dimensionScores.financial_foundation,
          market_intelligence_score: dimensionScores.market_intelligence,
          risk_management_score: dimensionScores.risk_management,
          support_systems_score: dimensionScores.support_systems,
          standout_bonus: standoutBonus,
          current_tier: tier,
          standout_strength_1: formData.standout_strength_1,
          standout_strength_2: formData.standout_strength_2,
          version_number: versionNumber,
          is_current: true,
        });

      if (historyError) throw historyError;

      // Set this version as current
      await supabase.rpc("set_current_assessment", {
        p_user_id: user.id,
        p_version_number: versionNumber,
      });

      // Update or insert comprehensive assessment (for backward compatibility)
      if (hasExistingData) {
        const { error: assessmentError } = await supabase
          .from("comprehensive_assessments")
          .update({
            ...formData,
            total_spi_score: totalScore,
            tier,
            strength_combination: strengthCombo,
            assessment_date: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (assessmentError) throw assessmentError;
      } else {
        const { error: assessmentError } = await supabase
          .from("comprehensive_assessments")
          .insert({
            user_id: user.id,
            ...formData,
            total_spi_score: totalScore,
            tier,
            strength_combination: strengthCombo,
            assessment_date: new Date().toISOString(),
          });

        if (assessmentError) throw assessmentError;
      }

      // Update user progress
      const response = await fetch(
        "/api/user-progress/comprehensive-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalScore,
            tier,
            strengthCombo,
            dimensionScores,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update progress");
      }

      // Send assessment completion email
      try {
        await fetch("/api/email/assessment-completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentName: "Comprehensive SPI Assessment",
            score: totalScore,
            tier,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the assessment submission if email fails
      }

      router.push(
        `/dashboard?message=Assessment completed successfully! Your SPI score is ${totalScore}% (${tier} tier)`
      );
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ComprehensiveAssessmentData,
    value: number
  ) => {
    if (value === -1) {
      // Handle calculator selections
      if (field === "net_worth") {
        setShowNetWorthCalculator(true);
        setShowSavingsCalculator(false);
        setFormData((prev) => ({ ...prev, [field]: value }));
      } else if (field === "monthly_savings") {
        setShowSavingsCalculator(true);
        setShowNetWorthCalculator(false);
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle click on calculator options even when already selected
  const handleOptionClick = (
    field: keyof ComprehensiveAssessmentData,
    value: number
  ) => {
    if (value === -1) {
      // Always open calculator when clicked, even if already selected
      if (field === "net_worth") {
        setShowNetWorthCalculator(true);
        setShowSavingsCalculator(false);
      } else if (field === "monthly_savings") {
        setShowSavingsCalculator(true);
        setShowNetWorthCalculator(false);
      }
    }
    handleInputChange(field, value);
  };

  // Helper function to render option with special styling for calculators
  const renderOption = (option: any, question: any) => {
    const isCalculatorOption = option.value === -1;
    const isSelected =
      formData[question.id as keyof ComprehensiveAssessmentData] ===
      option.value;

    // Check if we have a calculated value for this calculator
    const hasCalculatedValue =
      (question.id === "net_worth" && calculatorResults.netWorth !== null) ||
      (question.id === "monthly_savings" &&
        calculatorResults.monthlySavings !== null);

    // Get the display label for calculator options
    let displayLabel = option.label;
    if (isCalculatorOption && hasCalculatedValue) {
      if (question.id === "net_worth") {
        displayLabel = `${option.label} (Calculated: $${calculatorResults.netWorth?.toLocaleString()})`;
      } else if (question.id === "monthly_savings") {
        displayLabel = `${option.label} (Calculated: $${calculatorResults.monthlySavings?.toLocaleString()}/month)`;
      }
    }

    return (
      <label
        key={option.value}
        className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${
          isCalculatorOption
            ? hasCalculatedValue
              ? "border-green-600 bg-green-900/20 hover:bg-green-900/30"
              : "border-indigo-600 bg-indigo-900/20 hover:bg-indigo-900/30"
            : "border-gray-700 bg-gray-800 hover:bg-gray-700"
        } ${isSelected ? "ring-2 ring-orange-500" : ""}`}
        onClick={() => {
          if (isCalculatorOption && isSelected) {
            // If calculator option is already selected, still open the calculator
            handleOptionClick(
              question.id as keyof ComprehensiveAssessmentData,
              option.value
            );
          }
        }}
      >
        <input
          type="radio"
          name={question.id}
          value={option.value}
          checked={isSelected}
          onChange={() =>
            handleOptionClick(
              question.id as keyof ComprehensiveAssessmentData,
              option.value
            )
          }
          className="mt-1 mr-3"
        />
        <div>
          <div
            className={`font-medium ${
              isCalculatorOption
                ? hasCalculatedValue
                  ? "text-green-100"
                  : "text-indigo-100"
                : "text-gray-100"
            }`}
          >
            {displayLabel}
          </div>
          {option.description && (
            <div
              className={`text-sm ${
                isCalculatorOption
                  ? hasCalculatedValue
                    ? "text-green-300"
                    : "text-indigo-300"
                  : "text-gray-400"
              }`}
            >
              {option.description}
            </div>
          )}
        </div>
      </label>
    );
  };

  const handleSituationChange = (situation: CurrentSituation) => {
    setFormData((prev) => ({ ...prev, current_situation: situation }));
  };

  const handleFleetSizeChange = (size: number) => {
    setFormData((prev) => ({ ...prev, fleet_size: size }));
  };

  const handleLoadSourceChange = (source: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      load_sources: checked
        ? [...prev.load_sources, source]
        : prev.load_sources.filter((s) => s !== source),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const totalScore = calculateTotalSPIScore();
  const tier = getSPITier(totalScore);
  const strengthCombo = getStrengthCombination();

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold text-gray-100 hidden sm:inline">
                Comprehensive SPI Assessment
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {submitting
                ? "Processing..."
                : hasExistingData
                  ? "Update Assessment"
                  : "Complete Assessment"}
            </button>
          </div>
        </div>
      </div>

      <main className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                Complete Your SPI Assessment
              </h1>
              <p className="text-gray-400 mb-4">
                This comprehensive assessment evaluates all five dimensions of
                your Success Probability Index. Be honest—this assessment is
                designed to show you exactly where you stand and where to focus
                your efforts.
              </p>

              {/* Existing Data Banner */}
              {hasExistingData && (
                <div className="mb-6 bg-blue-900/20 border border-blue-800 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-300">
                        Previous Assessment Data Loaded
                      </h3>
                      <p className="text-sm text-blue-400 mt-1">
                        Your previous assessment responses have been loaded. You
                        can review and modify them as needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Situation Selector */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800 rounded-xl">
                <h3 className="text-xl font-bold text-blue-100 mb-3">
                  🚛 What is your current situation?
                </h3>
                <p className="text-blue-300 mb-4 font-medium">
                  Please select your current situation so we can provide
                  questions that are relevant to your specific circumstances.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      "Employee Driver",
                      "Carrier Authority",
                      "Leased O/O",
                      "Small Fleet",
                    ] as CurrentSituation[]
                  ).map((situation) => (
                    <label
                      key={situation}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.current_situation === situation
                          ? "border-blue-500 bg-blue-900/30 shadow-md"
                          : "border-gray-700 hover:border-blue-600 hover:bg-blue-900/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="current_situation"
                        value={situation}
                        checked={formData.current_situation === situation}
                        onChange={() => handleSituationChange(situation)}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-100">
                          {situation}
                        </div>
                        <div className="text-sm text-gray-400">
                          {situation === "Employee Driver" &&
                            "Driving for a company as an employee"}
                          {situation === "Carrier Authority" &&
                            "Have your own authority and operate independently"}
                          {situation === "Leased O/O" &&
                            "Lease your truck to a carrier"}
                          {situation === "Small Fleet" &&
                            "Own multiple trucks and manage drivers"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Selected:</strong> {formData.current_situation} -
                    This will customize your assessment questions.
                  </p>
                </div>
              </div>

              {/* Standout Strengths Assessment */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800 rounded-xl">
                <h3 className="text-xl font-bold text-purple-100 mb-3">
                  ✨ Take the StandOut Assessment
                </h3>
                <p className="text-purple-300 mb-6">
                  Discover your top 2 strengths using the StandOut assessment to
                  understand your unique talents and how they contribute to your
                  success.
                </p>

                <div className="mb-6 p-4 bg-purple-900/20 border border-purple-700 rounded-xl">
                  <h4 className="text-lg font-semibold text-purple-100 mb-2">
                    How to find your Standout Strengths:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-purple-200">
                    <li>
                      Take the free assessment at:{" "}
                      <a
                        href="https://www.marcusbuckingham.com/the-standout-assessment"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        StandOut Assessment
                      </a>
                    </li>
                    <li>Complete the quick questionnaire (about 15 minutes)</li>
                    <li>Get your top 2 strengths from the report</li>
                    <li>
                      Select them below to integrate into your SPI results
                    </li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Your Top Strength #1
                    </label>
                    <select
                      value={formData.standout_strength_1}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          standout_strength_1: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-purple-700 bg-gray-800 text-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your primary strength</option>
                      {[
                        "Pioneer",
                        "Influencer",
                        "Stimulator",
                        "Advisor",
                        "Connector",
                        "Provider",
                        "Equalizer",
                        "Teacher",
                        "Creator",
                      ]
                        .filter(
                          (strength) =>
                            strength !== formData.standout_strength_2
                        )
                        .map((strength) => (
                          <option key={strength} value={strength}>
                            {strength}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Your Top Strength #2
                    </label>
                    <select
                      value={formData.standout_strength_2}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          standout_strength_2: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-purple-700 bg-gray-800 text-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your second strength</option>
                      {[
                        "Pioneer",
                        "Influencer",
                        "Stimulator",
                        "Advisor",
                        "Connector",
                        "Provider",
                        "Equalizer",
                        "Teacher",
                        "Creator",
                      ]
                        .filter(
                          (strength) =>
                            strength !== formData.standout_strength_1
                        )
                        .map((strength) => (
                          <option key={strength} value={strength}>
                            {strength}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-900/30 rounded-xl">
                  <p className="text-sm text-purple-200">
                    <strong>Note:</strong> These strengths will be integrated
                    into your SPI assessment results to provide personalized
                    insights.
                  </p>
                </div>
              </div>

              {/* Contextual Questions Based on Situation */}
              {(formData.current_situation === "Small Fleet" ||
                formData.current_situation === "Carrier Authority") && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800 rounded-xl">
                  <h3 className="text-xl font-bold text-green-100 mb-3">
                    📋 Additional Information
                  </h3>

                  {/* Fleet Size Question (Small Fleet only) */}
                  {formData.current_situation === "Small Fleet" && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-200 mb-3">
                        How many trucks do you own?
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, "10+"].map((size) => (
                          <label
                            key={size}
                            className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                              formData.fleet_size === size
                                ? "border-green-500 bg-green-900/30 shadow-md"
                                : "border-gray-700 hover:border-green-600 hover:bg-green-900/20"
                            }`}
                          >
                            <input
                              type="radio"
                              name="fleet_size"
                              value={size}
                              checked={formData.fleet_size === size}
                              onChange={() =>
                                handleFleetSizeChange(size as number)
                              }
                              className="mr-2 w-4 h-4 text-green-600"
                            />
                            <span className="font-medium text-gray-100">
                              {size} {size === 1 ? "Truck" : "Trucks"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Load Sources Question */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-200 mb-3">
                      Where do you get your loads? (Select all that apply)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Load Boards (DAT, Truckstop, etc.)",
                        "Brokers",
                        "Direct Customers",
                        "Freight Forwarders",
                        "Contract Freight",
                      ].map((source) => (
                        <label
                          key={source}
                          className="flex items-center p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.load_sources.includes(source)}
                            onChange={(e) =>
                              handleLoadSourceChange(source, e.target.checked)
                            }
                            className="mr-3 w-4 h-4 text-green-600"
                          />
                          <span className="text-gray-900 dark:text-gray-100">
                            {source}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formData.load_sources.length > 0 && (
                      <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Selected sources:</strong>{" "}
                          {formData.load_sources.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-200 font-medium">
                      Assessment Overview
                    </p>
                    <p className="text-sm text-blue-300 mt-1">
                      This assessment contains{" "}
                      {
                        getAssessmentQuestions(formData.current_situation)
                          .length
                      }{" "}
                      questions across five dimensions. Take your time and
                      answer honestly. Your results will provide a clear roadmap
                      for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Financial Foundation Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Financial Foundation
                </h3>
                <p className="text-gray-300 mb-4">
                  Your financial foundation determines your ability to invest in
                  opportunities and weather challenges.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter((q) => q.dimension === "Financial Foundation")
                  .map((question, index) => (
                    <div
                      key={question.id}
                      className="mb-6 p-4 border border-gray-700 bg-gray-800 rounded-xl"
                    >
                      <label className="block text-sm font-medium text-gray-100 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      {/* Add helpful instructions for calculator questions */}
                      {(question.id === "net_worth" ||
                        question.id === "monthly_savings") && (
                        <div className="mb-3 p-3 bg-blue-900/20 border border-blue-700 rounded-xl">
                          <p className="text-sm text-blue-200">
                            <strong>💡 Tip:</strong> You can either use the
                            calculator for a precise calculation or select a
                            range if you already know your{" "}
                            {question.id === "net_worth"
                              ? "net worth"
                              : "monthly savings"}
                            .
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {question.options.map((option) => {
                          const isCalculatorOption = option.value === -1;
                          const isSelected =
                            formData[
                              question.id as keyof ComprehensiveAssessmentData
                            ] === option.value;

                          // Check if we have a calculated value for this calculator
                          const hasCalculatedValue =
                            (question.id === "net_worth" &&
                              calculatorResults.netWorth !== null) ||
                            (question.id === "monthly_savings" &&
                              calculatorResults.monthlySavings !== null);

                          // Get the display label for calculator options
                          let displayLabel = option.label;
                          if (isCalculatorOption && hasCalculatedValue) {
                            if (question.id === "net_worth") {
                              displayLabel = `${option.label} (Calculated: $${calculatorResults.netWorth?.toLocaleString()})`;
                            } else if (question.id === "monthly_savings") {
                              displayLabel = `${option.label} (Calculated: $${calculatorResults.monthlySavings?.toLocaleString()}/month)`;
                            }
                          }

                          return (
                            <label
                              key={option.value}
                              className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${
                                isCalculatorOption
                                  ? hasCalculatedValue
                                    ? "border-green-600 bg-green-900/20 hover:bg-green-900/30"
                                    : "border-indigo-600 bg-indigo-900/20 hover:bg-indigo-900/30"
                                  : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                              } ${isSelected ? "ring-2 ring-orange-500" : ""}`}
                              onClick={() => {
                                if (isCalculatorOption) {
                                  handleOptionClick(
                                    question.id as keyof ComprehensiveAssessmentData,
                                    option.value
                                  );
                                }
                              }}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option.value}
                                checked={isSelected}
                                onChange={() =>
                                  isCalculatorOption
                                    ? handleOptionClick(
                                        question.id as keyof ComprehensiveAssessmentData,
                                        option.value
                                      )
                                    : handleInputChange(
                                        question.id as keyof ComprehensiveAssessmentData,
                                        option.value
                                      )
                                }
                                className="mt-1 mr-3"
                              />
                              <div>
                                <div
                                  className={`font-medium ${
                                    isCalculatorOption
                                      ? hasCalculatedValue
                                        ? "text-green-100"
                                        : "text-indigo-100"
                                      : "text-gray-100"
                                  }`}
                                >
                                  {displayLabel}
                                </div>
                                {option.description && (
                                  <div
                                    className={`text-sm ${
                                      isCalculatorOption
                                        ? hasCalculatedValue
                                          ? "text-green-300"
                                          : "text-indigo-300"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {option.description}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Market Intelligence Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-500" />
                  Market Intelligence
                </h3>
                <p className="text-gray-300 mb-4">
                  Understanding the market, rates, and customer needs is crucial
                  for making profitable decisions.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter((q) => q.dimension === "Market Intelligence")
                  .map((question, index) => (
                    <div
                      key={question.id}
                      className="mb-6 p-4 border border-gray-700 bg-gray-800 rounded-xl"
                    >
                      <label className="block text-sm font-medium text-gray-100 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-start p-3 border border-gray-600 bg-gray-700 rounded-xl hover:bg-gray-600 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={
                                formData[
                                  question.id as keyof ComprehensiveAssessmentData
                                ] === option.value
                              }
                              onChange={() =>
                                handleInputChange(
                                  question.id as keyof ComprehensiveAssessmentData,
                                  option.value
                                )
                              }
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-100">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-sm text-gray-400">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Risk Management Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-500" />
                  Risk Management
                </h3>
                <p className="text-gray-300 mb-4">
                  How well you prepare for and manage risks determines your
                  business sustainability.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter((q) => q.dimension === "Risk Management")
                  .map((question, index) => (
                    <div
                      key={question.id}
                      className="mb-6 p-4 border border-gray-700 bg-gray-800 rounded-xl"
                    >
                      <label className="block text-sm font-medium text-gray-100 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-start p-3 border border-gray-600 bg-gray-700 rounded-xl hover:bg-gray-600 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={
                                formData[
                                  question.id as keyof ComprehensiveAssessmentData
                                ] === option.value
                              }
                              onChange={() =>
                                handleInputChange(
                                  question.id as keyof ComprehensiveAssessmentData,
                                  option.value
                                )
                              }
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-100">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-sm text-gray-400">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Support Systems Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-500" />
                  Support Systems
                </h3>
                <p className="text-gray-300 mb-4">
                  Your network, family support, and mentorship multiply your
                  individual efforts.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter((q) => q.dimension === "Support Systems")
                  .map((question, index) => (
                    <div
                      key={question.id}
                      className="mb-6 p-4 border border-gray-700 bg-gray-800 rounded-xl"
                    >
                      <label className="block text-sm font-medium text-gray-100 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-start p-3 border border-gray-600 bg-gray-700 rounded-xl hover:bg-gray-600 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={
                                formData[
                                  question.id as keyof ComprehensiveAssessmentData
                                ] === option.value
                              }
                              onChange={() =>
                                handleInputChange(
                                  question.id as keyof ComprehensiveAssessmentData,
                                  option.value
                                )
                              }
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-100">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-sm text-gray-400">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {error && (
                <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Calculator Modals */}
      <CalculatorModal
        isOpen={showNetWorthCalculator}
        onClose={() => {
          setShowNetWorthCalculator(false);
          // Clear the calculator selection if no value was chosen
          if (formData.net_worth === -1) {
            setFormData((prev) => ({ ...prev, net_worth: 0 }));
          }
        }}
        title="Net Worth Calculator"
        icon={<Calculator className="w-6 h-6 text-blue-600" />}
      >
        <NetWorthCalculator
          initialValue={calculatorResults.netWorth ?? undefined}
          onCalculate={(netWorth) => {
            setCalculatorResults((prev) => ({ ...prev, netWorth }));
            setShowNetWorthCalculator(false);
            // Auto-select the appropriate range based on calculated value
            let selectedValue = 0;
            if (netWorth < -25000) selectedValue = 0;
            else if (netWorth < -10000) selectedValue = 3;
            else if (netWorth < 0) selectedValue = 6;
            else if (netWorth < 10000) selectedValue = 10;
            else if (netWorth < 50000) selectedValue = 12;
            else selectedValue = 14;
            setFormData((prev) => ({ ...prev, net_worth: selectedValue }));
          }}
          onCancel={() => {
            setShowNetWorthCalculator(false);
            // Clear the calculator selection if no value was chosen
            if (formData.net_worth === -1) {
              setFormData((prev) => ({ ...prev, net_worth: 0 }));
            }
          }}
        />
      </CalculatorModal>

      <CalculatorModal
        isOpen={showSavingsCalculator}
        onClose={() => {
          setShowSavingsCalculator(false);
          // Clear the calculator selection if no value was chosen
          if (formData.monthly_savings === -1) {
            setFormData((prev) => ({ ...prev, monthly_savings: 0 }));
          }
        }}
        title="Monthly Savings Calculator"
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
      >
        <MonthlySavingsCalculator
          initialValue={calculatorResults.monthlySavings ?? undefined}
          onCalculate={(monthlySavings) => {
            setCalculatorResults((prev) => ({ ...prev, monthlySavings }));
            setShowSavingsCalculator(false);
            // Auto-select the appropriate range based on calculated value
            let selectedValue = 0;
            if (monthlySavings < 0) selectedValue = 0;
            else if (monthlySavings < 500) selectedValue = 4;
            else if (monthlySavings < 1000) selectedValue = 7;
            else if (monthlySavings < 2000) selectedValue = 9;
            else selectedValue = 10.5;
            setFormData((prev) => ({
              ...prev,
              monthly_savings: selectedValue,
            }));
          }}
          onCancel={() => {
            setShowSavingsCalculator(false);
            // Clear the calculator selection if no value was chosen
            if (formData.monthly_savings === -1) {
              setFormData((prev) => ({ ...prev, monthly_savings: 0 }));
            }
          }}
        />
      </CalculatorModal>
    </div>
  );
}
