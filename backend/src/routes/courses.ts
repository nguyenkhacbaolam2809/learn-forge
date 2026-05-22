import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createCourse, getCoursesByUserId } from '../utils/db';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const courses = getCoursesByUserId(userId!);
  res.json({ courses });
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Tiêu đề khóa học là bắt buộc' });
  }
  const course = createCourse(userId!, title, description || '');
  res.json({ course });
});

export default router;
