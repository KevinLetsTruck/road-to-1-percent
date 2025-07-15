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

interface ProgressMilestoneEmailProps {
  userName: string
  milestone: string
  progress: number
  achievements: string[]
}

export const ProgressMilestoneEmail: React.FC<ProgressMilestoneEmailProps> = ({
  userName,
  milestone,
  progress,
  achievements
}) => {
  const previewText = `Congratulations ${userName}! You've reached ${milestone} with ${progress}% progress.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🏆 Milestone Achieved!</Heading>
            <Text style={heroText}>
              Amazing work, {userName}! You've reached the <strong>{milestone}</strong> milestone.
            </Text>
          </Section>

          <Section style={progressSection}>
            <Heading style={h2}>Your Progress</Heading>
            <div style={progressCard}>
              <Text style={progressText}>{progress}% Complete</Text>
            </div>
          </Section>

          <Section style={achievementsSection}>
            <Heading style={h2}>Recent Achievements</Heading>
            {achievements.map((achievement, index) => (
              <Text key={index} style={listItem}>
                ✅ {achievement}
              </Text>
            ))}
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://roadto1percent.com/dashboard">
              Continue Your Progress
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Keep up the excellent work! You're making incredible progress.
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

const progressSection = {
  padding: '0 40px',
}

const progressCard = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const progressText = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const achievementsSection = {
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

export default ProgressMilestoneEmail 