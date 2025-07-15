import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr
} from '@react-email/components'
import * as React from 'react'

interface TierUpgradeEmailProps {
  userName: string
  oldTier: string
  newTier: string
  achievements: string[]
  nextGoals: string[]
}

export const TierUpgradeEmail: React.FC<TierUpgradeEmailProps> = ({
  userName,
  oldTier,
  newTier,
  achievements,
  nextGoals
}) => {
  const previewText = `🚀 Congratulations ${userName}! You've upgraded from ${oldTier} to ${newTier}!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🚀 Tier Upgrade!</Heading>
            <Text style={heroText}>
              Congratulations {userName}! You've successfully upgraded from{' '}
              <strong>{oldTier}</strong> to <strong>{newTier}</strong>!
            </Text>
          </Section>

          <Section style={achievementsSection}>
            <Heading style={h2}>Key Achievements</Heading>
            {achievements.map((achievement, index) => (
              <Text key={index} style={listItem}>
                🎯 {achievement}
              </Text>
            ))}
          </Section>

          <Section style={goalsSection}>
            <Heading style={h2}>Next Goals</Heading>
            {nextGoals.map((goal, index) => (
              <Text key={index} style={listItem}>
                📋 {goal}
              </Text>
            ))}
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://roadto1percent.com/dashboard">
              Continue Your Journey
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              You're making incredible progress! Keep pushing toward the 1%.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '25px 0',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#1e3a8a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  padding: '0',
}

const heroText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
}

const achievementsSection = {
  padding: '0 40px',
}

const goalsSection = {
  padding: '0 40px',
}

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
  paddingLeft: '20px',
}

const ctaSection = {
  padding: '0 40px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#1e3a8a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '20px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const footer = {
  padding: '0 40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
}

export default TierUpgradeEmail 