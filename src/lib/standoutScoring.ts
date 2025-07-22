// Standout Strength Scoring System

export type StandoutStrength = 
  | 'Pioneer' 
  | 'Influencer' 
  | 'Stimulator' 
  | 'Advisor' 
  | 'Connector' 
  | 'Provider' 
  | 'Equalizer' 
  | 'Teacher' 
  | 'Creator';

interface StrengthCombination {
  strengths: [StandoutStrength, StandoutStrength];
  score: number;
  description: string;
}

// Define all scored combinations
const strengthCombinations: StrengthCombination[] = [
  // Tier 1: Power Combinations (8-10 points)
  { strengths: ['Pioneer', 'Influencer'], score: 10, description: 'Visionary leadership with exceptional people skills' },
  { strengths: ['Pioneer', 'Creator'], score: 10, description: 'Innovation powerhouse with execution ability' },
  { strengths: ['Advisor', 'Connector'], score: 9, description: 'Strategic networking for maximum leverage' },
  { strengths: ['Influencer', 'Connector'], score: 9, description: 'Relationship mastery for business growth' },
  { strengths: ['Creator', 'Advisor'], score: 8, description: 'Smart innovation with strategic thinking' },
  
  // Tier 2: Strong Combinations (6-7 points)
  { strengths: ['Pioneer', 'Advisor'], score: 7, description: 'Visionary approach with wisdom and strategy' },
  { strengths: ['Creator', 'Teacher'], score: 7, description: 'Innovation with scalable knowledge transfer' },
  { strengths: ['Influencer', 'Stimulator'], score: 7, description: 'Motivational leadership that drives results' },
  { strengths: ['Connector', 'Provider'], score: 6, description: 'Reliable networking with consistent support' },
  { strengths: ['Advisor', 'Teacher'], score: 6, description: 'Knowledge leverage for sustainable growth' },
  
  // Tier 3: Supportive Combinations (4-5 points)
  { strengths: ['Provider', 'Equalizer'], score: 5, description: 'Operational excellence with fairness' },
  { strengths: ['Teacher', 'Provider'], score: 5, description: 'Consistent delivery with educational value' },
  { strengths: ['Stimulator', 'Creator'], score: 5, description: 'Creative energy that sparks innovation' },
  { strengths: ['Equalizer', 'Advisor'], score: 4, description: 'Fair and balanced strategic guidance' },
  { strengths: ['Stimulator', 'Provider'], score: 4, description: 'Energetic support for team success' }
];

// Function to calculate standout score
export function calculateStandoutScore(strength1: string, strength2: string): { score: number; description: string } {
  // Handle empty selections
  if (!strength1 || !strength2) {
    return { score: 0, description: 'No standout strengths selected' };
  }
  
  // Sort strengths alphabetically for consistent lookup
  const sortedStrengths = [strength1, strength2].sort() as [StandoutStrength, StandoutStrength];
  
  // Find matching combination
  const combination = strengthCombinations.find(combo => {
    const comboSorted = [...combo.strengths].sort();
    return comboSorted[0] === sortedStrengths[0] && comboSorted[1] === sortedStrengths[1];
  });
  
  // Return specific score if found, otherwise default
  if (combination) {
    return { score: combination.score, description: combination.description };
  }
  
  // Default score for unlisted combinations
  return { score: 3, description: 'Complementary strengths with growth potential' };
}

// Function to get tier based on standout score
export function getStandoutTier(score: number): string {
  if (score >= 8) return 'Elite Synergy (Top 10%)';
  if (score >= 6) return 'Strong Synergy (Top 25%)';
  if (score >= 4) return 'Good Synergy (Top 50%)';
  return 'Building Synergy';
}