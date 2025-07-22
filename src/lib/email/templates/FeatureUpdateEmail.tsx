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

interface FeatureUpdateEmailProps {
  userName: string
  featureName: string
  description: string
  benefits: string[]
  actionUrl: string
}

export const FeatureUpdateEmail: React.FC<FeatureUpdateEmailProps> = ({
  userName,
  featureName,
  description,
  benefits,
  actionUrl
}) => {
  const previewText = `✨ New Feature: ${userName}, check out our new ${featureName}!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>✨ New Feature Available!</Heading>
            <Text style={heroText}>
              Hi {userName}, we've just launched <strong>{featureName}</strong> to help you on your journey!
            </Text>
          </Section>

          <Section style={contentSection}>
            <Heading style={h2}>What's New</Heading>
            <Text style={text}>{description}</Text>
          </Section>

          <Section style={benefitsSection}>
            <Heading style={h2}>Key Benefits</Heading>
            {benefits.map((benefit, index) => (
              <Text key={index} style={listItem}>
                ✅ {benefit}
              </Text>
            ))}
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={actionUrl}>
              Try It Now
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              We're constantly improving to help you reach the 1% faster!
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

const contentSection = {
  padding: '0 40px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px 0',
}

const benefitsSection = {
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

export default FeatureUpdateEmail 