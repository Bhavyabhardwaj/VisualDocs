import nodemailer from 'nodemailer';
import { TeamRole } from '@prisma/client';

interface InvitationEmailData {
  email: string;
  token: string;
  inviterName: string;
  role: TeamRole;
  expiresAt: Date;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587');

    // If email credentials are not configured, log a warning
    if (!emailUser || !emailPassword) {
      console.warn('⚠️  Email credentials not configured. Emails will not be sent.');
      console.warn('⚠️  Set EMAIL_USER and EMAIL_PASSWORD in .env to enable email sending.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465, // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });

      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendTeamInvitation(data: InvitationEmailData): Promise<boolean> {
    if (!this.transporter) {
      console.log('📧 Email would be sent to:', data.email);
      console.log('🔗 Invitation token:', data.token);
      console.log('⚠️  Email service not configured - invitation created but email not sent');
      return false;
    }

    try {
      const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/accept?token=${data.token}`;
      const expiryDate = new Date(data.expiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const roleDescriptions = {
        OWNER: 'Owner - Full access to manage the entire workspace',
        ADMIN: 'Admin - Full access to manage team and projects',
        MEMBER: 'Member - Can create and edit projects',
        VIEWER: 'Viewer - Read-only access to view projects',
      };

      const mailOptions = {
        from: `"VisualDocs Team" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: '🎉 You\'ve been invited to join VisualDocs!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Team Invitation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #171717 0%, #262626 100%); padding: 40px 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                          🎉 You're Invited!
                        </h1>
                        <p style="margin: 12px 0 0; color: #d4d4d4; font-size: 16px;">
                          Join your team on VisualDocs
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; color: #171717; font-size: 16px; line-height: 1.6;">
                          Hi there! 👋
                        </p>
                        <p style="margin: 0 0 24px; color: #171717; font-size: 16px; line-height: 1.6;">
                          <strong>${data.inviterName}</strong> has invited you to join their team on <strong>VisualDocs</strong> as a <strong>${data.role}</strong>.
                        </p>
                        
                        <!-- Role Info Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; border-radius: 12px; margin-bottom: 28px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 8px; color: #171717; font-size: 14px; font-weight: 600;">
                                Your Role:
                              </p>
                              <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.5;">
                                ${roleDescriptions[data.role]}
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                          <tr>
                            <td align="center">
                              <a href="${inviteUrl}" style="display: inline-block; background-color: #171717; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(23, 23, 23, 0.2);">
                                Accept Invitation
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 12px; color: #525252; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0 0 24px; color: #0ea5e9; font-size: 13px; word-break: break-all; background-color: #f5f5f5; padding: 12px; border-radius: 8px; font-family: monospace;">
                          ${inviteUrl}
                        </p>
                        
                        <!-- Warning Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                          <tr>
                            <td style="padding: 16px;">
                              <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                                <strong>⚠️ Note:</strong> This invitation will expire on <strong>${expiryDate}</strong>. Make sure to accept it before then!
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #fafafa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                        <p style="margin: 0 0 8px; color: #737373; font-size: 13px;">
                          This invitation was sent by ${data.inviterName}
                        </p>
                        <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                          If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                  
                  <!-- Email Footer -->
                  <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                      <td style="text-align: center; padding: 20px;">
                        <p style="margin: 0 0 8px; color: #737373; font-size: 12px;">
                          © ${new Date().getFullYear()} VisualDocs. All rights reserved.
                        </p>
                        <p style="margin: 0; color: #a3a3a3; font-size: 11px;">
                          Made with ❤️ for better team collaboration
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `
Hi there!

${data.inviterName} has invited you to join their team on VisualDocs as a ${data.role}.

Your Role: ${roleDescriptions[data.role]}

Accept your invitation by clicking the link below:
${inviteUrl}

This invitation will expire on ${expiryDate}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} VisualDocs
        `.trim(),
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Invitation email sent successfully to:', data.email);
      return true;
    } catch (error) {
      console.error('❌ Failed to send invitation email:', error);
      return false;
    }
  }

  // Test email connection
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
