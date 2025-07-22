"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { calculateStandoutScore, getStandoutTier } from "@/lib/standoutScoring";

// Register a web-safe font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: "bold" }],
});

// Create comprehensive styles matching the results page
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 3,
  },
  congratsBox: {
    backgroundColor: "#dbeafe",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  congratsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  congratsText: {
    fontSize: 11,
    color: "#1e40af",
  },
  overallScoreSection: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  scoreColumn: {
    flex: 1,
    alignItems: "center",
  },
  bigScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  tierBadge: {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  probabilitySection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#e0e7ff",
    borderRadius: 6,
  },
  probabilityTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4338ca",
    marginBottom: 4,
  },
  probabilityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4338ca",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  dimensionCard: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  dimensionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dimensionName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  dimensionScore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  dimensionDescription: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  standoutSection: {
    backgroundColor: "#fef3c7",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  standoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 10,
  },
  standoutSubtitle: {
    fontSize: 12,
    color: "#92400e",
    marginBottom: 5,
  },
  strengthsGrid: {
    flexDirection: "row",
    marginTop: 15,
  },
  strengthColumn: {
    flex: 1,
    marginRight: 10,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  strengthItem: {
    fontSize: 10,
    color: "#78350f",
    marginBottom: 3,
    paddingLeft: 10,
  },
  insightBox: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
});

// Color mapping for progress bars
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "#10b981";
  if (percentage >= 60) return "#3b82f6";
  if (percentage >= 40) return "#f59e0b";
  return "#ef4444";
};

const getDimensionDescription = (name: string) => {
  const descriptions: Record<string, string> = {
    "Financial Foundation":
      "Your current financial stability and resources available for business growth",
    "Market Intelligence":
      "Understanding of market dynamics, rates, lanes, and customer needs",
    "Risk Management":
      "Ability to identify, assess, and mitigate business risks",
    "Support Systems": "Network of mentors, peers, and professional resources",
  };
  return descriptions[name] || "";
};

const getStrengthInsights = (actualCombo: string) => {
  const [strength1, strength2] = actualCombo.split(" + ");
  const insights: Record<string, any> = {
    Pioneer: {
      title: "The Trailblazer",
      description:
        "You see opportunities where others see obstacles. Your innovative mindset and willingness to try new approaches gives you a competitive edge.",
      strengths: [
        "Innovative problem-solving",
        "First-mover advantage",
        "Adaptability to change",
        "Creative solutions",
      ],
    },
    Influencer: {
      title: "The Leader",
      description:
        "Your natural charisma and leadership abilities help you build strong relationships with shippers, brokers, and drivers.",
      strengths: [
        "Builds loyal relationships",
        "Attracts quality drivers",
        "Negotiates favorable rates",
        "Creates positive culture",
      ],
    },
    Advisor: {
      title: "The Strategist",
      description:
        "Your analytical mind and wisdom help you make calculated decisions. You excel at seeing the big picture.",
      strengths: [
        "Data-driven decisions",
        "Provides valuable guidance",
        "Sees problems early",
        "Builds trust through expertise",
      ],
    },
    Provider: {
      title: "The Reliable One",
      description:
        "Your commitment to taking care of others makes you a trusted partner in the industry.",
      strengths: [
        "Unshakeable loyalty",
        "Delivers on promises",
        "Creates stability",
        "Long-term relationships",
      ],
    },
    Creator: {
      title: "The Builder",
      description:
        "You have a natural ability to build systems and processes that scale, turning ideas into reality.",
      strengths: [
        "Builds efficient systems",
        "Scales operations well",
        "Process optimization",
        "Innovation mindset",
      ],
    },
    Teacher: {
      title: "The Mentor",
      description:
        "Your ability to break down complex concepts and share knowledge helps others succeed.",
      strengths: [
        "Develops strong teams",
        "Clear communication",
        "Patient guidance",
        "Knowledge sharing",
      ],
    },
    Connector: {
      title: "The Network Builder",
      description:
        "You naturally bring people together and see connections others miss.",
      strengths: [
        "Extensive networks",
        "Win-win partnerships",
        "Resource finding",
        "Relationship building",
      ],
    },
    Equalizer: {
      title: "The Fair Dealer",
      description:
        "Your commitment to fairness and justice makes you a trusted mediator and partner.",
      strengths: [
        "Fair negotiations",
        "Conflict resolution",
        "Balanced decisions",
        "Ethical leadership",
      ],
    },
    Stimulator: {
      title: "The Energizer",
      description:
        "Your enthusiasm is contagious. You excel at motivating others and creating excitement.",
      strengths: [
        "Motivates teams",
        "High energy",
        "Pushes through obstacles",
        "Inspires others",
      ],
    },
  };

  return {
    strength1: insights[strength1] || {
      title: strength1,
      description: "",
      strengths: [],
    },
    strength2: insights[strength2] || {
      title: strength2,
      description: "",
      strengths: [],
    },
  };
};

interface AssessmentResultsPDFProps {
  userProgress: any;
  spiScore: number;
  dimensions: Array<{
    name: string;
    score: number;
    max: number;
    percentage: number;
    color: string;
  }>;
}

const getProbabilityData = (spiScore: number, tier: string) => {
  if (tier === "1%") {
    return {
      probability: 76,
      range: "High",
      description: "You have a strong foundation for success",
    };
  } else if (tier === "9%") {
    if (spiScore >= 65) {
      return {
        probability: 51,
        range: "Medium-High",
        description: "You're on the right track with room to grow",
      };
    } else {
      return {
        probability: 26,
        range: "Medium",
        description: "Focus on key areas to improve your odds",
      };
    }
  } else {
    return {
      probability: 0,
      range: "Low",
      description: "Significant improvements needed in multiple areas",
    };
  }
};

const AssessmentResultsPDF: React.FC<AssessmentResultsPDFProps> = ({
  userProgress,
  spiScore,
  dimensions,
}) => {
  try {
    const firstName = userProgress?.first_name || "User";
    const lastName = userProgress?.last_name || "";
    const tier = userProgress?.current_tier || "90%";
    const strength1 = userProgress?.standout_strength_1 || "";
    const strength2 = userProgress?.standout_strength_2 || "";
    const actualStrengthCombo =
      strength1 && strength2 ? `${strength1} + ${strength2}` : "Balanced";
    const standoutResult = calculateStandoutScore(strength1, strength2);
    const standoutTier = getStandoutTier(standoutResult.score);
    const probabilityData = getProbabilityData(spiScore, tier);
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const strengthInsights =
      strength1 && strength2 ? getStrengthInsights(actualStrengthCombo) : null;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Comprehensive SPI Assessment Results
            </Text>
            <Text style={styles.subtitle}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.subtitle}>{currentDate}</Text>
          </View>

          {/* Congratulations Box */}
          <View style={styles.congratsBox}>
            <Text style={styles.congratsTitle}>
              Congratulations on completing your assessment!
            </Text>
            <Text style={styles.congratsText}>
              Your Success Probability Index (SPI) score of {spiScore} puts you
              in the {tier} tier. This comprehensive analysis will guide your
              journey to trucking business ownership.
            </Text>
          </View>

          {/* Overall Score Section */}
          <View style={styles.overallScoreSection}>
            <View style={styles.scoreRow}>
              <View style={styles.scoreColumn}>
                <Text style={styles.bigScore}>{spiScore}</Text>
                <Text style={styles.scoreLabel}>Total SPI Score</Text>
              </View>
              <View style={styles.scoreColumn}>
                <Text style={styles.tierBadge}>Top {tier} Tier</Text>
                <Text style={styles.scoreLabel}>Performance Tier</Text>
              </View>
            </View>

            <View style={styles.probabilitySection}>
              <Text style={styles.probabilityTitle}>Success Probability</Text>
              <Text style={styles.probabilityValue}>
                {probabilityData.probability}% ({probabilityData.range} Range)
              </Text>
              <Text style={{ fontSize: 10, color: "#4338ca", marginTop: 4 }}>
                {probabilityData.description}
              </Text>
            </View>
          </View>

          {/* Standout Strengths Section */}
          {strength1 && strength2 && (
            <View style={styles.standoutSection}>
              <Text style={styles.standoutTitle}>{actualStrengthCombo}</Text>
              <Text style={styles.standoutSubtitle}>
                Synergy Level: {standoutTier}
              </Text>
              <Text style={styles.standoutSubtitle}>
                Bonus Points: +{Math.round(standoutResult.score * 2)}
              </Text>

              {strengthInsights && (
                <View style={styles.strengthsGrid}>
                  <View style={styles.strengthColumn}>
                    <Text style={styles.strengthTitle}>
                      {strength1}: {strengthInsights.strength1.title}
                    </Text>
                    {strengthInsights.strength1.strengths.map(
                      (str: string, idx: number) => (
                        <Text key={idx} style={styles.strengthItem}>
                          • {str}
                        </Text>
                      )
                    )}
                  </View>
                  <View style={styles.strengthColumn}>
                    <Text style={styles.strengthTitle}>
                      {strength2}: {strengthInsights.strength2.title}
                    </Text>
                    {strengthInsights.strength2.strengths.map(
                      (str: string, idx: number) => (
                        <Text key={idx} style={styles.strengthItem}>
                          • {str}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Dimension Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance by Dimension</Text>
            {dimensions &&
              dimensions.map((dimension, index) => (
                <View key={index} style={styles.dimensionCard}>
                  <View style={styles.dimensionHeader}>
                    <Text style={styles.dimensionName}>{dimension.name}</Text>
                    <Text style={styles.dimensionScore}>
                      {dimension.score}/{dimension.max} ({dimension.percentage}
                      %)
                    </Text>
                  </View>
                  <Text style={styles.dimensionDescription}>
                    {getDimensionDescription(dimension.name)}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${dimension.percentage}%`,
                          backgroundColor: getProgressColor(
                            dimension.percentage
                          ),
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Generated from spiassessment.com | Road to 1% - Comprehensive
            Assessment Platform
          </Text>
        </Page>
      </Document>
    );
  } catch (error) {
    console.error("Error creating PDF:", error);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error generating PDF. Please try again.</Text>
        </Page>
      </Document>
    );
  }
};

export default AssessmentResultsPDF;
