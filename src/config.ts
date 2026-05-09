import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
}

function validateConfig(): Config {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    port: parseInt(process.env.PORT || '3001', 10),
    smtpHost: process.env.SMTP_HOST!,
    smtpPort: parseInt(process.env.SMTP_PORT!, 10),
    smtpUser: process.env.SMTP_USER!,
    smtpPass: process.env.SMTP_PASS!,
    fromEmail: process.env.FROM_EMAIL!,
  };
}

export const config = validateConfig();
