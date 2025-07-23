interface DimensionInsight {
  quickWins: string[];
  longTermGoals: string[];
  description: string;
}

interface ScoreBasedInsights {
  low: DimensionInsight;    // 0-40% of max score
  medium: DimensionInsight; // 41-70% of max score
  high: DimensionInsight;   // 71-100% of max score
}

export const dimensionInsights: Record<string, ScoreBasedInsights> = {
  "Financial Foundation": {
    low: {
      description: "You're building your financial foundation. Focus on basic money management and creating stability.",
      quickWins: [
        "Track all expenses for one week",
        "Cancel unused subscriptions",
        "Start emergency fund with $500",
        "Review insurance policies for better rates"
      ],
      longTermGoals: [
        "Build 3-month emergency fund",
        "Improve credit score to 650+",
        "Create monthly budget system",
        "Eliminate high-interest debt"
      ]
    },
    medium: {
      description: "You have a solid foundation. Time to optimize and expand your financial strategies.",
      quickWins: [
        "Automate 20% savings rate",
        "Negotiate better freight rates",
        "Open high-yield business savings",
        "Review tax deductions with CPA"
      ],
      longTermGoals: [
        "Build 6-month emergency fund",
        "Establish equipment replacement fund",
        "Create passive income streams",
        "Maximize retirement contributions"
      ]
    },
    high: {
      description: "You're financially strong. Focus on wealth building and advanced strategies.",
      quickWins: [
        "Explore tax-advantaged investments",
        "Set up solo 401(k) or SEP-IRA",
        "Implement profit-first accounting",
        "Create investment policy statement"
      ],
      longTermGoals: [
        "Build 12-month operating reserves",
        "Diversify into real estate or stocks",
        "Create multi-business income streams",
        "Establish family wealth plan"
      ]
    }
  },
  
  "Market Intelligence": {
    low: {
      description: "Start gathering market data to make informed decisions and find opportunities.",
      quickWins: [
        "Join one trucking Facebook group",
        "Track rates on your top 3 lanes",
        "Call 3 shippers for direct freight",
        "Subscribe to DAT or Truckstop basics"
      ],
      longTermGoals: [
        "Build database of 20+ direct shippers",
        "Learn seasonal freight patterns",
        "Develop lane specialization",
        "Create basic market analysis system"
      ]
    },
    medium: {
      description: "You understand your market. Now leverage that knowledge for competitive advantage.",
      quickWins: [
        "Analyze competitor pricing strategies",
        "Test premium service offerings",
        "Join industry association",
        "Create shipper feedback system"
      ],
      longTermGoals: [
        "Develop 50% direct freight book",
        "Build predictive rate modeling",
        "Create market intelligence dashboard",
        "Establish strategic partnerships"
      ]
    },
    high: {
      description: "You're a market expert. Use your insights to shape strategy and capture premium opportunities.",
      quickWins: [
        "Launch value-added services",
        "Create market reports for shippers",
        "Mentor other owner-operators",
        "Explore freight brokerage license"
      ],
      longTermGoals: [
        "Build proprietary freight network",
        "Develop technology solutions",
        "Create industry consulting service",
        "Establish market-making position"
      ]
    }
  },
  
  "Risk Management": {
    low: {
      description: "Build basic protections to safeguard your business from common risks.",
      quickWins: [
        "Review insurance coverage gaps",
        "Create simple backup plans",
        "Start health savings account",
        "Document key processes"
      ],
      longTermGoals: [
        "Build comprehensive insurance portfolio",
        "Create emergency response procedures",
        "Develop multiple income sources",
        "Establish legal protections (LLC, etc.)"
      ]
    },
    medium: {
      description: "You have good risk awareness. Strengthen your defensive strategies and contingencies.",
      quickWins: [
        "Stress-test business scenarios",
        "Diversify customer base",
        "Create equipment backup plans",
        "Review contracts with attorney"
      ],
      longTermGoals: [
        "Build crisis management playbook",
        "Create business continuity plan",
        "Develop strategic reserves",
        "Implement risk scoring system"
      ]
    },
    high: {
      description: "You're well-protected. Focus on turning risk management into competitive advantage.",
      quickWins: [
        "Offer risk consulting to shippers",
        "Create innovative insurance products",
        "Develop predictive risk models",
        "Launch safety training program"
      ],
      longTermGoals: [
        "Build anti-fragile business model",
        "Create industry risk standards",
        "Develop risk arbitrage strategies",
        "Establish captive insurance company"
      ]
    }
  },
  
  "Support Systems": {
    low: {
      description: "Start building your network. Success in trucking requires strong relationships.",
      quickWins: [
        "Join local trucking association",
        "Find accountability partner",
        "Schedule monthly family meetings",
        "Connect with 3 other O/Os"
      ],
      longTermGoals: [
        "Build network of 20+ industry contacts",
        "Find experienced mentor",
        "Create family support structure",
        "Join or create mastermind group"
      ]
    },
    medium: {
      description: "You have good support. Deepen relationships and expand your influence.",
      quickWins: [
        "Start helping other drivers",
        "Create referral network",
        "Host local trucker meetup",
        "Strengthen vendor relationships"
      ],
      longTermGoals: [
        "Build strategic advisory board",
        "Develop industry reputation",
        "Create mutual aid network",
        "Establish thought leadership"
      ]
    },
    high: {
      description: "You're well-connected. Leverage your network to create opportunities for others.",
      quickWins: [
        "Launch mentorship program",
        "Create industry resources",
        "Facilitate strategic introductions",
        "Start industry podcast/blog"
      ],
      longTermGoals: [
        "Build industry-changing initiatives",
        "Create driver development programs",
        "Establish industry standards",
        "Launch social impact ventures"
      ]
    }
  }
};

export function getDimensionInsights(dimensionName: string, score: number, maxScore: number): DimensionInsight {
  const insights = dimensionInsights[dimensionName];
  if (!insights) {
    return {
      description: "Focus on continuous improvement in this area.",
      quickWins: ["Review current performance", "Set specific goals", "Track progress weekly", "Seek expert advice"],
      longTermGoals: ["Develop comprehensive strategy", "Build measurement systems", "Create improvement plan", "Achieve industry leadership"]
    };
  }
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage <= 40) {
    return insights.low;
  } else if (percentage <= 70) {
    return insights.medium;
  } else {
    return insights.high;
  }
} 