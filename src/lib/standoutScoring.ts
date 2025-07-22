// Standout Strength Scoring System

export type StandoutStrength =
  | "Pioneer"
  | "Influencer"
  | "Stimulator"
  | "Advisor"
  | "Connector"
  | "Provider"
  | "Equalizer"
  | "Teacher"
  | "Creator";

interface StrengthCombination {
  primary: StandoutStrength;
  secondary: StandoutStrength;
  score: number;
  description: string;
}

// Define all 72 ordered combinations (primary-secondary matters)
const strengthCombinations: StrengthCombination[] = [
  // Pioneer as Primary (8 combinations)
  {
    primary: "Pioneer",
    secondary: "Influencer",
    score: 10,
    description: "Visionary leader who drives change through people",
  },
  {
    primary: "Pioneer",
    secondary: "Creator",
    score: 10,
    description: "Innovation architect who turns vision into reality",
  },
  {
    primary: "Pioneer",
    secondary: "Advisor",
    score: 8,
    description: "Strategic visionary with wisdom and foresight",
  },
  {
    primary: "Pioneer",
    secondary: "Connector",
    score: 7,
    description: "Network builder who opens new opportunities",
  },
  {
    primary: "Pioneer",
    secondary: "Stimulator",
    score: 7,
    description: "Energetic trailblazer who inspires action",
  },
  {
    primary: "Pioneer",
    secondary: "Teacher",
    score: 6,
    description: "Educational innovator who shares breakthrough ideas",
  },
  {
    primary: "Pioneer",
    secondary: "Provider",
    score: 5,
    description: "Reliable innovator who delivers on promises",
  },
  {
    primary: "Pioneer",
    secondary: "Equalizer",
    score: 4,
    description: "Fair-minded visionary who includes everyone",
  },

  // Influencer as Primary (8 combinations)
  {
    primary: "Influencer",
    secondary: "Pioneer",
    score: 9,
    description: "People-first leader with innovative vision",
  },
  {
    primary: "Influencer",
    secondary: "Connector",
    score: 10,
    description: "Master networker who builds powerful alliances",
  },
  {
    primary: "Influencer",
    secondary: "Stimulator",
    score: 8,
    description: "Motivational force who energizes teams",
  },
  {
    primary: "Influencer",
    secondary: "Advisor",
    score: 7,
    description: "Trusted guide who influences through wisdom",
  },
  {
    primary: "Influencer",
    secondary: "Creator",
    score: 6,
    description: "Creative leader who brings people together",
  },
  {
    primary: "Influencer",
    secondary: "Teacher",
    score: 6,
    description: "Educational influencer who shapes minds",
  },
  {
    primary: "Influencer",
    secondary: "Provider",
    score: 5,
    description: "Supportive leader who delivers results",
  },
  {
    primary: "Influencer",
    secondary: "Equalizer",
    score: 4,
    description: "Fair leader who values all voices",
  },

  // Creator as Primary (8 combinations)
  {
    primary: "Creator",
    secondary: "Pioneer",
    score: 9,
    description: "Innovative builder with visionary thinking",
  },
  {
    primary: "Creator",
    secondary: "Advisor",
    score: 9,
    description: "Strategic innovator with deep expertise",
  },
  {
    primary: "Creator",
    secondary: "Teacher",
    score: 8,
    description: "Educational creator who shares knowledge",
  },
  {
    primary: "Creator",
    secondary: "Influencer",
    score: 7,
    description: "Creative force who inspires others",
  },
  {
    primary: "Creator",
    secondary: "Stimulator",
    score: 6,
    description: "Energetic builder who motivates teams",
  },
  {
    primary: "Creator",
    secondary: "Connector",
    score: 6,
    description: "Innovative networker who builds bridges",
  },
  {
    primary: "Creator",
    secondary: "Provider",
    score: 5,
    description: "Reliable creator who consistently delivers",
  },
  {
    primary: "Creator",
    secondary: "Equalizer",
    score: 4,
    description: "Fair-minded builder who values balance",
  },

  // Advisor as Primary (8 combinations)
  {
    primary: "Advisor",
    secondary: "Connector",
    score: 10,
    description: "Strategic networker with deep wisdom",
  },
  {
    primary: "Advisor",
    secondary: "Creator",
    score: 8,
    description: "Wise innovator who guides development",
  },
  {
    primary: "Advisor",
    secondary: "Pioneer",
    score: 7,
    description: "Strategic guide with future vision",
  },
  {
    primary: "Advisor",
    secondary: "Influencer",
    score: 7,
    description: "Trusted counselor who shapes decisions",
  },
  {
    primary: "Advisor",
    secondary: "Teacher",
    score: 7,
    description: "Knowledge expert who educates strategically",
  },
  {
    primary: "Advisor",
    secondary: "Stimulator",
    score: 5,
    description: "Motivational advisor who energizes growth",
  },
  {
    primary: "Advisor",
    secondary: "Provider",
    score: 5,
    description: "Reliable consultant who delivers wisdom",
  },
  {
    primary: "Advisor",
    secondary: "Equalizer",
    score: 5,
    description: "Fair advisor who balances perspectives",
  },

  // Connector as Primary (8 combinations)
  {
    primary: "Connector",
    secondary: "Influencer",
    score: 9,
    description: "Relationship master who maximizes networks",
  },
  {
    primary: "Connector",
    secondary: "Advisor",
    score: 9,
    description: "Strategic networker with expert guidance",
  },
  {
    primary: "Connector",
    secondary: "Pioneer",
    score: 7,
    description: "Network builder who opens new frontiers",
  },
  {
    primary: "Connector",
    secondary: "Creator",
    score: 6,
    description: "Collaborative builder who links resources",
  },
  {
    primary: "Connector",
    secondary: "Provider",
    score: 6,
    description: "Reliable networker who delivers connections",
  },
  {
    primary: "Connector",
    secondary: "Stimulator",
    score: 5,
    description: "Energetic networker who sparks collaboration",
  },
  {
    primary: "Connector",
    secondary: "Teacher",
    score: 5,
    description: "Educational connector who shares knowledge",
  },
  {
    primary: "Connector",
    secondary: "Equalizer",
    score: 4,
    description: "Fair networker who includes everyone",
  },

  // Stimulator as Primary (8 combinations)
  {
    primary: "Stimulator",
    secondary: "Influencer",
    score: 8,
    description: "Energetic motivator who inspires action",
  },
  {
    primary: "Stimulator",
    secondary: "Pioneer",
    score: 7,
    description: "Dynamic innovator who energizes change",
  },
  {
    primary: "Stimulator",
    secondary: "Creator",
    score: 6,
    description: "Creative catalyst who sparks innovation",
  },
  {
    primary: "Stimulator",
    secondary: "Connector",
    score: 5,
    description: "Energetic networker who builds momentum",
  },
  {
    primary: "Stimulator",
    secondary: "Advisor",
    score: 5,
    description: "Motivational guide who energizes strategy",
  },
  {
    primary: "Stimulator",
    secondary: "Teacher",
    score: 5,
    description: "Dynamic educator who inspires learning",
  },
  {
    primary: "Stimulator",
    secondary: "Provider",
    score: 4,
    description: "Energetic supporter who drives delivery",
  },
  {
    primary: "Stimulator",
    secondary: "Equalizer",
    score: 3,
    description: "Fair motivator who energizes all",
  },

  // Teacher as Primary (8 combinations)
  {
    primary: "Teacher",
    secondary: "Creator",
    score: 8,
    description: "Educational innovator who builds knowledge",
  },
  {
    primary: "Teacher",
    secondary: "Advisor",
    score: 7,
    description: "Expert educator who guides with wisdom",
  },
  {
    primary: "Teacher",
    secondary: "Pioneer",
    score: 6,
    description: "Visionary educator who teaches innovation",
  },
  {
    primary: "Teacher",
    secondary: "Influencer",
    score: 6,
    description: "Influential educator who shapes minds",
  },
  {
    primary: "Teacher",
    secondary: "Connector",
    score: 5,
    description: "Educational networker who shares resources",
  },
  {
    primary: "Teacher",
    secondary: "Provider",
    score: 5,
    description: "Reliable educator who consistently shares",
  },
  {
    primary: "Teacher",
    secondary: "Stimulator",
    score: 5,
    description: "Dynamic educator who energizes learning",
  },
  {
    primary: "Teacher",
    secondary: "Equalizer",
    score: 4,
    description: "Fair educator who teaches all equally",
  },

  // Provider as Primary (8 combinations)
  {
    primary: "Provider",
    secondary: "Connector",
    score: 6,
    description: "Reliable networker who delivers results",
  },
  {
    primary: "Provider",
    secondary: "Pioneer",
    score: 5,
    description: "Dependable innovator who executes vision",
  },
  {
    primary: "Provider",
    secondary: "Creator",
    score: 5,
    description: "Consistent builder who delivers quality",
  },
  {
    primary: "Provider",
    secondary: "Influencer",
    score: 5,
    description: "Supportive leader who delivers for people",
  },
  {
    primary: "Provider",
    secondary: "Teacher",
    score: 5,
    description: "Reliable educator who consistently shares",
  },
  {
    primary: "Provider",
    secondary: "Advisor",
    score: 5,
    description: "Dependable consultant who delivers wisdom",
  },
  {
    primary: "Provider",
    secondary: "Equalizer",
    score: 5,
    description: "Fair provider who supports all equally",
  },
  {
    primary: "Provider",
    secondary: "Stimulator",
    score: 4,
    description: "Energetic supporter who delivers enthusiasm",
  },

  // Equalizer as Primary (8 combinations)
  {
    primary: "Equalizer",
    secondary: "Advisor",
    score: 5,
    description: "Fair counselor who balances perspectives",
  },
  {
    primary: "Equalizer",
    secondary: "Provider",
    score: 5,
    description: "Balanced supporter who serves all fairly",
  },
  {
    primary: "Equalizer",
    secondary: "Pioneer",
    score: 4,
    description: "Fair innovator who includes everyone",
  },
  {
    primary: "Equalizer",
    secondary: "Influencer",
    score: 4,
    description: "Balanced leader who values all voices",
  },
  {
    primary: "Equalizer",
    secondary: "Creator",
    score: 4,
    description: "Fair builder who creates for all",
  },
  {
    primary: "Equalizer",
    secondary: "Connector",
    score: 4,
    description: "Inclusive networker who connects fairly",
  },
  {
    primary: "Equalizer",
    secondary: "Teacher",
    score: 4,
    description: "Fair educator who teaches equally",
  },
  {
    primary: "Equalizer",
    secondary: "Stimulator",
    score: 3,
    description: "Balanced motivator who energizes fairly",
  },
];

// Function to calculate standout score
export function calculateStandoutScore(
  strength1: string,
  strength2: string
): { score: number; description: string } {
  // Handle empty selections
  if (!strength1 || !strength2) {
    return { score: 0, description: "No standout strengths selected" };
  }

  // Find matching combination considering order
  const combination = strengthCombinations.find(
    (combo) => combo.primary === strength1 && combo.secondary === strength2
  );

  // Return specific score if found
  if (combination) {
    return { score: combination.score, description: combination.description };
  }

  // This shouldn't happen if all 72 combinations are defined, but just in case
  return { score: 3, description: "Unique combination with growth potential" };
}

// Function to get tier based on standout score
export function getStandoutTier(score: number): string {
  if (score >= 9) return "Elite Synergy (Top 10%)";
  if (score >= 7) return "Strong Synergy (Top 25%)";
  if (score >= 5) return "Good Synergy (Top 50%)";
  return "Building Synergy";
}
