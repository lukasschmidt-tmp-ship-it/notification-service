import express from 'express';
import { config } from './config';
import { notificationRouter } from './routes/notifications';
import { EmailTemplateService } from './services/emailTemplateService';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());

const emailService = new EmailTemplateService();
emailService.initialize();

app.use('/api/notifications', notificationRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service', version: '2.1.0' });
});

app.listen(config.port, () => {
  logger.info(`Notification service running on port ${config.port}`);
});
