import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr
} from '@react-email/components'
import * as React from 'react'

interface AssessmentCompletionEmailProps {
  userName: string
  assessmentName: string
  score: number
  tier: string
  nextSteps: string[]
}

export const AssessmentCompletionEmail: React.FC<AssessmentCompletionEmailProps> = ({
  userName,
  assessmentName,
  score,
  tier,
  nextSteps
}) => {
  const previewText = `Congratulations ${userName}! You've completed the ${assessmentName} assessment with a score of ${score}.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🎉 Assessment Complete!</Heading>
            <Text style={heroText}>
              Great job, {userName}! You've successfully completed the{' '}
              <strong>{assessmentName}</strong> assessment.
            </Text>
          </Section>

          <Section style={scoreSection}>
            <Heading style={h2}>Your Results</Heading>
            <div style={scoreCard}>
              <Text style={scoreText}>Score: {score}/100</Text>
              <Text style={tierText}>Current Tier: {tier}</Text>
            </div>
          </Section>

          <Section style={nextStepsSection}>
            <Heading style={h2}>Next Steps</Heading>
            {nextSteps.map((step, index) => (
              <Text key={index} style={listItem}>
                • {step}
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
              Keep pushing forward! Every assessment brings you closer to the 1%.
            </Text>
            <Text style={footerText}>
              Questions? Reply to this email or contact{' '}
              <Link href="mailto:support@roadto1percent.com" style={link}>
                support@roadto1percent.com
              </Link>
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

const scoreSection = {
  padding: '0 40px',
}

const scoreCard = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const scoreText = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const tierText = {
  color: '#1e3a8a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const nextStepsSection = {
  padding: '0 40px',
}

const list = {
  margin: '0',
  padding: '0',
  listStyle: 'none',
}

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 10px 0',
  paddingLeft: '20px',
  position: 'relative' as const,
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

const link = {
  color: '#1e3a8a',
  textDecoration: 'underline',
}

export default AssessmentCompletionEmail 