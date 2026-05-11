import express from 'express';
import { Pool } from 'pg';
import { config } from './config';
import { notificationRouter } from './routes/notifications';
import { EmailTemplateService } from './services/emailTemplateService';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.connect()
  .then(() => logger.info('Connected to PostgreSQL'))
  .catch((err) => {
    logger.error(`Failed to connect to PostgreSQL: ${err.message}`);
    process.exit(1);
  });

const emailService = new EmailTemplateService();
emailService.initialize();

app.use('/api/notifications', notificationRouter);

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'notification-service', version: '2.1.0', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'unhealthy', service: 'notification-service', db: 'disconnected' });
  }
});

app.listen(config.port, () => {
  logger.info(`Notification service running on port ${config.port}`);
});

export { pool };
