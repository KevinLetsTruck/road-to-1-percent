import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_CONFIG = {
  from: {
    name: 'Road to 1%',
    email: 'noreply@roadto1percent.com' // Update this to your verified domain
  },
  replyTo: 'support@roadto1percent.com'
}

export const EMAIL_TEMPLATES = {
  ASSESSMENT_COMPLETION: 'assessment-completion',
  PROGRESS_MILESTONE: 'progress-milestone',
  TIER_UPGRADE: 'tier-upgrade',
  WEEKLY_REMINDER: 'weekly-reminder',
  WELCOME: 'welcome',
  FEATURE_UPDATE: 'feature-update'
} as const

export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES] 