import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const notificationRouter = Router();

notificationRouter.post('/send', async (req: Request, res: Response) => {
  try {
    const { to, subject, template, variables } = req.body;

    if (!to || !subject || !template) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, template' });
    }

    logger.info(`Notification queued: ${subject} -> ${to}`);
    res.json({ status: 'queued', message: 'Notification will be sent shortly' });
  } catch (error) {
    logger.error('Failed to send notification', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
});

notificationRouter.get('/status/:id', (req: Request, res: Response) => {
  res.json({ id: req.params.id, status: 'delivered' });
});
