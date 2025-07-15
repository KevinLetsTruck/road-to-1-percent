import { resend, EMAIL_CONFIG } from './config'
import { render } from '@react-email/render'
import { AssessmentCompletionEmail } from './templates/AssessmentCompletionEmail'
import { ProgressMilestoneEmail } from './templates/ProgressMilestoneEmail'
import { TierUpgradeEmail } from './templates/TierUpgradeEmail'
import { WeeklyReminderEmail } from './templates/WeeklyReminderEmail'
import { WelcomeEmail } from './templates/WelcomeEmail'
import { FeatureUpdateEmail } from './templates/FeatureUpdateEmail'

export interface EmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export class EmailService {
  static async sendAssessmentCompletion(
    to: string,
    data: {
      userName: string
      assessmentName: string
      score: number
      tier: string
      nextSteps: string[]
    }
  ) {
    const html = render(AssessmentCompletionEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🎉 Assessment Complete: ${data.assessmentName}`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendProgressMilestone(
    to: string,
    data: {
      userName: string
      milestone: string
      progress: number
      achievements: string[]
    }
  ) {
    const html = render(ProgressMilestoneEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🏆 Milestone Achieved: ${data.milestone}`,
      html: await html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendTierUpgrade(
    to: string,
    data: {
      userName: string
      oldTier: string
      newTier: string
      achievements: string[]
      nextGoals: string[]
    }
  ) {
    const html = render(TierUpgradeEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🚀 Tier Upgrade: Welcome to ${data.newTier}!`,
      html: await html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendWeeklyReminder(
    to: string,
    data: {
      userName: string
      incompleteAssessments: string[]
      progress: number
      motivationalMessage: string
    }
  ) {
    const html = render(WeeklyReminderEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [to],
      subject: `📅 Weekly Progress Check-in`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendWelcome(
    to: string,
    data: {
      userName: string
      firstAssessment: string
      gettingStartedSteps: string[]
    }
  ) {
    const html = render(WelcomeEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [to],
      subject: `🎯 Welcome to Road to 1%!`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendFeatureUpdate(
    to: string,
    data: {
      userName: string
      featureName: string
      description: string
      benefits: string[]
      actionUrl: string
    }
  ) {
    const html = render(FeatureUpdateEmail(data))
    
    return await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [to],
      subject: `✨ New Feature: ${data.featureName}`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }
} 