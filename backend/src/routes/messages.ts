import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getMessages, createMessage } from '../utils/db';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const msgs = getMessages(100);
  res.json({ messages: msgs });
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { text } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Text required' });
  const msg = createMessage(userId, text);
  res.json({ message: msg });
});

export default router;
