import nodemailer from 'nodemailer';
import { config } from '../config';
import { EmailTemplateService } from './emailTemplateService';
import { logger } from '../utils/logger';

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private templateService: EmailTemplateService;

  constructor(templateService: EmailTemplateService) {
    this.templateService = templateService;
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = this.templateService.renderTemplate('welcome', { name });
    await this.transporter.sendMail({
      from: config.fromEmail,
      to,
      subject: 'Welcome!',
      html,
    });
    logger.info(`Welcome email sent to ${to}`);
  }

  async sendNotification(to: string, subject: string, template: string, vars: Record<string, string>): Promise<void> {
    const html = this.templateService.renderTemplate(template, vars);
    await this.transporter.sendMail({
      from: config.fromEmail,
      to,
      subject,
      html,
    });
    logger.info(`Notification sent to ${to}: ${subject}`);
  }
}
