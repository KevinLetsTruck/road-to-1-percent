import { resend, EMAIL_CONFIG } from './config'

export class SimpleEmailService {
  static async sendAssessmentCompletion(
    to: string,
    data: {
      userName: string
      assessmentName: string
      score: number
      tier: string
    }
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">🎉 Assessment Complete!</h1>
        <p>Great job, ${data.userName}! You've successfully completed the <strong>${data.assessmentName}</strong> assessment.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h2 style="color: #059669; margin: 0;">Score: ${data.score}/100</h2>
          <p style="color: #1e3a8a; font-weight: bold; margin: 10px 0 0 0;">Current Tier: ${data.tier}</p>
        </div>
        <p>Keep pushing forward! Every assessment brings you closer to the 1%.</p>
        <a href="https://roadto1percent.com/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Continue Your Journey</a>
      </div>
    `

    if (!resend) {
      console.log('Resend not configured, skipping email send')
      return { success: true }
    }

    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🎉 Assessment Complete: ${data.assessmentName}`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendWelcome(
    to: string,
    data: {
      userName: string
    }
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">🎯 Welcome to Road to 1%!</h1>
        <p>Hi ${data.userName}, welcome to your journey toward the top 1% of professional drivers!</p>
        <p>We recommend starting with the <strong>Financial Foundation</strong> assessment to establish your baseline.</p>
        <a href="https://roadto1percent.com/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Start Your First Assessment</a>
      </div>
    `

    if (!resend) {
      console.log('Resend not configured, skipping email send')
      return { success: true }
    }

    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🎯 Welcome to Road to 1%!`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }

  static async sendTierUpgrade(
    to: string,
    data: {
      userName: string
      oldTier: string
      newTier: string
    }
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">🚀 Tier Upgrade!</h1>
        <p>Congratulations ${data.userName}! You've successfully upgraded from <strong>${data.oldTier}</strong> to <strong>${data.newTier}</strong>!</p>
        <p>You're making incredible progress! Keep pushing toward the 1%.</p>
        <a href="https://roadto1percent.com/dashboard" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Continue Your Journey</a>
      </div>
    `

    if (!resend) {
      console.log('Resend not configured, skipping email send')
      return { success: true }
    }

    return await resend.emails.send({
      from: EMAIL_CONFIG.from.email,
      to: [to],
      subject: `🚀 Tier Upgrade: Welcome to ${data.newTier}!`,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })
  }
} 